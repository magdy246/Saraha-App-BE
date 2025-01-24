import joi from "joi";
import { enumGender } from "../../DB/models/users.model.js";
import { generalRules } from "../../utils/generalRules/index.js";

export const signUpSchema = {
    body: joi.object({
        name: joi.string().min(3).max(5).required(),
        email: joi.string().email().required(),
        password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/).required(),
        confirmPassword: joi.string().valid(joi.ref("password")).required(),
        gender: joi.string().valid(enumGender.male, enumGender.female).required(),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).required(),
    }),
}

export const signInSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}

export const updateProfileSchema = {
    body: joi.object({
        name: joi.string().min(3).max(30).optional(),
        gender: joi.string().valid(enumGender.male, enumGender.female).optional(),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).optional(),
    }).min(1)
}


export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: joi.string().required(),
        newPassword: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/).required(),
        confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
    })
}

