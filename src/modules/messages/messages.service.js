import messagesModel from "../../DB/models/messages.model.js";
import path from "path";
import dotenv from "dotenv";
import { asyncHandler } from "../../utils/error/index.js";
import MessagesModel from "../../DB/models/messages.model.js";
import UsersModel from "../../DB/models/users.model.js";
dotenv.config({ path: path.resolve("config/.env") });

export const sendMessage = asyncHandler(async (req, res, next) => {
    const { content, userId } = req.body;

    if (!content) {
        return next(new Error("Content is required."))
    }

    if (!userId) {
        return next(new Error("User ID is required."))
    }

    if (userId === req.user.id) {
        return next(new Error("You cannot send a message to yourself."))
    }

    const user = await UsersModel.findById(userId);
    if (!user) {
        return next(new Error("User not found."));
    }

    const newMessage = await MessagesModel.create({ content, userId });

    res.status(201).json({ message: "Message sent successfully.", newMessage, });
});

export const getMessages = asyncHandler(async (req, res, next) => {
    const messages = await messagesModel.find({ userId: req.user._id });

    if (!messages || messages.length === 0) {
        return next(new Error("No messages for this user"))
    }

    return res.status(200).json({ message: "message retrieved", messages });
}
)