import joi from "joi";

export const sendMessageSchema = {
    body: joi.object({
        content: joi.string().min(1).required(),
        userId: joi.string().required(),
    })
}