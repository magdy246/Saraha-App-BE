import jwt from "jsonwebtoken"

export const VerifyToken = async (token, SIGNTURE) => {
    return jwt.verify(token, SIGNTURE)
}