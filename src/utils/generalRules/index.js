import joi from "joi"
import { Types } from "mongoose"
export const customId = (value, helper) => {
    let data = Types.ObjectId.isValid(value)
    return data ? value : helper.message("id is not valid")
}

export const generalRules = {
    objectId: joi.string().custom(customId),
    headers: joi.object({
        authorization: joi.string().required(),
        host: joi.string(),
        accept: joi.string(),
        connection: joi.string(),
        'cache-control': joi.string(),
        'content-type': joi.string(),
        'content-length': joi.string(),
        'postman-token': joi.string(),
        'user-agent': joi.string(),
        'accept-encoding': joi.string(),
    })
}