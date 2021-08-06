import express from "express";
import { signin } from "../controllers/user";

const userRouter = express.Router();

userRouter.post("/signin", signin);

export default userRouter;
