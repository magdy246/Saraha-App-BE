import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import UsersModel from '../DB/models/users.model.js';
import { asyncHandler } from '../utils/index.js';

dotenv.config({ path: path.resolve("config/.env") });

export const roles = {
    user: "user",
    admin: "admin",
};

// Authentication Middleware
export const authentication = asyncHandler(async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return next(new Error("Authorization token is required"));
    }

    const [prefix, accessToken] = token.split(" ");

    if (!prefix || !accessToken) {
        return next(new Error("Invalid authorization token format"));
    }

    let SIGNATURE;
    if (prefix === "Bearer") {
        SIGNATURE = process.env.SECRET_KEY_TOKEN_USER;
    } else if (prefix === "Admin") {
        SIGNATURE = process.env.SECRET_KEY_TOKEN_ADMIN;
    } else {
        return next(new Error("Invalid authorization token prefix"));
    }

    const decoded = jwt.verify(accessToken, SIGNATURE);

    if (!decoded?.userid) {
        return next(new Error("Invalid token payload"));
    }

    const user = await UsersModel.findById(decoded.userid);
    if (!user) {
        return next(new Error("User not found"));
    }

    if (user?.isDeleted) {
        return next(new Error("user deleted"));
    }

    if (parseInt(user?.passwordChangedAt?.getTime() / 1000) > decoded.iat) {
        return next(new Error("token has expired"));
    }

    req.user = user;
    next();

});

// Authorization Middleware
export const authorization = (requiredRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { user } = req;

        if (!requiredRoles.includes(user.role)) {
            return next(new Error("Access denied: insufficient permissions"));
        }

        next();
    })
};
