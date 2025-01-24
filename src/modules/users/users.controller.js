import { Router } from "express";
import { confirmEmail, getProfile, login, signup, updateProfile, updatePassword, freezeAccounte, shareProfile } from "./users.service.js";
import { authentication, authorization, roles } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { signInSchema, signUpSchema, updateProfileSchema, updatePasswordSchema } from "./user.validation.js";

const usersRouter = Router()

usersRouter.post('/signup', validation(signUpSchema), signup)
usersRouter.post('/login', validation(signInSchema), login)
usersRouter.get('/confirmEmail/:token', confirmEmail)
usersRouter.get('/', authentication, authorization(Object.values(roles)), getProfile);
usersRouter.patch('/', authentication, authorization(Object.values(roles)), validation(updateProfileSchema), updateProfile);
usersRouter.patch('/update-password', authentication, authorization(Object.values(roles)), validation(updatePasswordSchema), updatePassword);
usersRouter.delete('/freeze-account', authentication, authorization(Object.values(roles)), freezeAccounte);
usersRouter.get('/share-profile/:id', authentication, authorization(Object.values(roles)), shareProfile);

export default usersRouter