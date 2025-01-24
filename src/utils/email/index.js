import { EventEmitter } from "events"
import {generateToken} from "../token/index.js"
import sendMail from "../../service/sendEmail.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve("config/.env") });

export const eventEmitter = new EventEmitter()

eventEmitter.on("SendeningEmail", async (data) => {
    const { email } = data
    const token = await generateToken({
        payload: { email },
        SECRET: process.env.SIGNTURE_CONFIRMATION
    });
    const Link = `http://localhost:3000/users/confirmEmail/${token}`;
    const emailSender = await sendMail(email, "confirmEmail", `<a href="${Link}">Confirm Email</a>`);
    if (!emailSender) {
        console.error("Error sending confirmation email");
        throw new Error("Failed to send confirmation email");
    }
})