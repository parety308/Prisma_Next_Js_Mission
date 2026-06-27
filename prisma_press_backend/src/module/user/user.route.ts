import { Router, type Request, type Response } from "express";
import userController from "./user.controller";

const router = Router();

router.post("/users/register",userController.registerUser)

export const userRouter = router;