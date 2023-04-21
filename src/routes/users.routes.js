import { Router } from "express";
import { SignUp, SignIn, LogOut } from "../controllers/users.controller.js";

import checkToken from "../middlewares/checkToken.middleware.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";

import userSignUpSchema from "../schemas/userSignUp.schema.js";
import userSignInSchema from "../schemas/userSignIn.schema.js";

const userRoutes = Router();
userRoutes.post("/sign-up", validateSchema(userSignUpSchema), SignUp);
userRoutes.post("/sign-in", validateSchema(userSignInSchema), SignIn);
userRoutes.delete("/logout", checkToken, LogOut);

export default userRoutes;
