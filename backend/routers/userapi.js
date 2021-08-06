import express from "express";
import { auth } from "../auth";
import {
  signin,
  signup,
  checkIdExists,
  checkNicknameExists,
  isOnline,
} from "../controllers/user";

const userApi = express.Router();

userApi.post("/signin", signin);
userApi.post("/signup", signup);
userApi.get("/check-id/:id", checkIdExists);
userApi.get("/check-name/:name", checkNicknameExists);
userApi.get("/isOnline", auth, isOnline);

export default userApi;
