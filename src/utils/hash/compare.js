import bcrypt from "bcrypt";

export const Compare = async ({ password, hashed }) => {
    return bcrypt.compareSync(password, hashed)
}