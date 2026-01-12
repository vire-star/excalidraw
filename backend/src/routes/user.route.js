import express from "express";
import { getUser, login, register } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import { LoginSchema, UserSchema } from "../lib/zodSchema.js";
import { auth } from "../middleware/authMiddleware.js";


const userRoute = express.Router()


userRoute.post('/register',validate(UserSchema), register)
userRoute.post('/login',validate(LoginSchema), login)
userRoute.get('/getUser', auth, getUser)

export default userRoute