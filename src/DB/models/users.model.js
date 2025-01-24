import mongoose from "mongoose";
import { roles } from "../../middleware/auth.js";

export const enumGender = {
    male: "male",
    female: "female"
}
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 10,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
    },
    phone: {
        type: "string",
        required: true,
    },
    gender: {
        type: "string",
        required: true,
        enum: Object.values(enumGender),
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.user,
    },
    passwordChangedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timeseries: true,
});

const UsersModel = mongoose.models.Users || mongoose.model("Users", usersSchema);

export default UsersModel;