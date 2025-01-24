import CryptoJS from "crypto-js";

export const Decrypt = async ({ key, SIGNTURE = process.env.SIGNTURE }) => {
    return CryptoJS.AES.encrypt(key, SIGNTURE).toString(CryptoJS.enc.Utf8)
}