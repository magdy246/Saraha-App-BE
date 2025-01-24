import jwt from "jsonwebtoken"

export const generateToken = async ({ payload = {}, SECRET, option }) => {
    return jwt.sign(payload, SECRET, option);
}