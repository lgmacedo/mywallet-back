import {Router} from 'express';
import { SignUp, SignIn, LogOut } from '../controllers/users.controller.js';

const userRoutes = Router();
userRoutes.post("/sign-up", SignUp);
userRoutes.post("/sign-in", SignIn);
userRoutes.delete("/logout", LogOut);

export default userRoutes;