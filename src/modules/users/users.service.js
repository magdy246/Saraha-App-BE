import UsersModel from "../../DB/models/users.model.js";
import bcrypt from "bcrypt";
import { VerifyToken, generateToken, Encrypt, Decrypt, asyncHandler, eventEmitter, Hash, Compare } from "../../utils/index.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve("config/.env") });

export const signup = asyncHandler(async (req, res, next) => {
    const { name, email, password, confirmPassword, phone, gender } = req.body;

    if (password !== confirmPassword) {
        return next(new Error("Passwords do not match"))
    }

    const userExist = await UsersModel.findOne({ email });
    if (userExist) {
        return next(new Error("Email already exists"))
    }

    const hash = await Hash({ password, SALT_ROUNDS: process.env.SALT_ROUNDS });

    const phoneCrypto = await Encrypt({ key: phone, SIGNTURE: process.env.SIGNTURE });

    eventEmitter.emit("SendeningEmail", { email })

    const newUser = await UsersModel.create({ name, email, password: hash, phone: phoneCrypto, gender });

    return res.status(200).json({ msg: "User added successfully", newUser });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;

    if (!token) {
        return next(new Error("Token is required"))
    }

    const decoded = await VerifyToken(token, process.env.SIGNTURE_CONFIRMATION);
    if (!decoded?.email) {
        return next(new Error("Invalid or expired token"))
    }

    const user = await UsersModel.findOne({ email: decoded.email, confirmed: false });

    if (!user) {
        return next(new Error("User not found"))
    }

    user.confirmed = true;
    await user.save();

    return res.status(200).json({ msg: "Email successfully confirmed" });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await UsersModel.findOne({ email });
    if (!user) {
        return next(new Error("Invalid Email"))
    }

    const checkPassword = await Compare({ password, hashed: user.password });
    if (!checkPassword) {
        return next(new Error("Invalid Password"))
    }

    const token = await generateToken({
        payload: { email, userid: user._id },
        SECRET: user.role == "user" ? process.env.SECRET_KEY_TOKEN_USER : process.env.SECRET_KEY_TOKEN_ADMIN,
        option: { expiresIn: "1h" }
    });
    return res.status(200).json({ msg: "User logged in successfully", token });
});

export const getProfile = asyncHandler(async (req, res) => {
    const { user } = req;
    if (!user) {
        return next(new Error("User not found"))
    }

    const allUserData = await UsersModel.findById(user._id).lean();
    if (!allUserData) {
        return next(new Error("User data not found"))
    }

    const phoneDecrypted = await Decrypt({ key: allUserData.phone, SIGNTURE: process.env.SIGNTURE });

    return res.status(200).json({
        msg: "Profile fetched successfully", user: { ...allUserData, phone: phoneDecrypted }
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { user } = req;
    if (!user) {
        return next(new Error("User not found"))
    }

    const { name, gender, phone } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (gender) updateData.gender = gender;
    if (phone) {
        updateData.phone = Encrypt({ key: phone, SIGNTURE: process.env.SIGNTURE });
    }

    if (Object.keys(updateData).length === 0) {
        return next(new Error("No data provided to update"))
    }

    const updatedUser = await UsersModel.findByIdAndUpdate(
        user._id,
        updateData,
        { new: true }
    ).lean();

    if (!updatedUser) {
        return next(new Error("Failed to update user profile"))
    }

    const phoneDecrypted = updatedUser.phone
        ? Decrypt({ key: updatedUser.phone, SIGNTURE: process.env.SIGNTURE })
        : undefined;

    return res.status(200).json({
        message: "Profile updated successfully",
        user: { ...updatedUser, phone: phoneDecrypted || updatedUser.phone },
    });
});

export const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { user } = req;

    if (!user) {
        return next(new Error("User not found"))
    }

    const existingUser = await UsersModel.findById(user._id);
    if (!existingUser) {
        return next(new Error("User not found"))
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isPasswordValid) {
        return next(new Error("Old password is incorrect"))
    }

    const isNewPasswordSame = await bcrypt.compare(newPassword, existingUser.password);
    if (isNewPasswordSame) {
        return next(new Error("New password cannot be the same as the old password"))
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS);

    const updatedUser = await UsersModel.findByIdAndUpdate(
        user._id,
        { password: hashedNewPassword, passwordChangedAt: Date.now() }, { new: true }
    );

    const updatedUserWithoutPassword = updatedUser.toObject();
    return res.status(200).json({
        message: "Password updated successfully",
        user: updatedUserWithoutPassword,
    });
});

export const freezeAccounte = asyncHandler(async (req, res) => {
    const user = await UsersModel.findByIdAndUpdate(req.user._id, { isDeleted: true, passwordChangedAt: Date.now() }, { new: true })
    return res.status(200).json({
        message: "Account deleted successfully",
        user
    });
});

export const shareProfile = asyncHandler(async (req, res) => {
    const user = await UsersModel.findById(req.params.id).select("name email gander role")
    if (!user) {
        return next(new Error("User not found"))
    }
    return res.status(200).json({
        message: "Profile shared successfully",
        user
    });
});