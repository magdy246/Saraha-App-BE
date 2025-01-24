import CryptoJS from "crypto-js";

export const Encrypt = async ({ key, SIGNTURE = process.env.SIGNTURE }) => {
    return CryptoJS.AES.encrypt(key, SIGNTURE).toString()
}