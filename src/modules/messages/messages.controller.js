import { Router } from "express";
import { sendMessage, getMessages } from "./messages.service.js";
import { validation } from "../../middleware/validation.js";
import { sendMessageSchema } from "./messages.validation.js";
import { authentication, authorization, roles } from "../../middleware/auth.js";

const messagesRouter = Router()

messagesRouter.post("/", authentication, authorization(Object.values(roles)), validation(sendMessageSchema), sendMessage)
messagesRouter.get("/", authentication, authorization(Object.values(roles)), getMessages);

export default messagesRouter