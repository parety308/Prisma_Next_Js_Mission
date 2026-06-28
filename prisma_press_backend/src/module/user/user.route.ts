import { Router, type Request, type Response } from "express";
import userController from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
const requiredRoles = [Role.admin, Role.author, Role.user];
router.post("/register", userController.registerUser);
router.get("/me", auth(requiredRoles), userController.getUserProfile);
router.put('/my-profile',auth([Role.admin,Role.user]) ,userController.updateUserProfile);

export const userRouter = router;