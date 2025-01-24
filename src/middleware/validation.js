import { asyncHandler } from "../utils/index.js";

export const validation = (Schema) => {
    return asyncHandler(async (req, res, next) => {
        const validationResult = []
        for (const key of Object.keys(Schema)) {
            const validationError = Schema[key].validate(req[key], { abortEarly: false })
            if (validationError?.error) {
                validationResult.push(validationError.error.details);
            }
        }
        if (validationResult.length > 0) {
            return next(new Error(validationResult, { cause: 400 }));
        }
        next()
    });
}