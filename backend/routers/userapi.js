import express from "express";
import {
  signin,
  signup,
  checkIdExists,
  checkNicknameExists,
} from "../controllers/user";

const userApi = express.Router();

userApi.post("/signin", signin);
userApi.post("/signup", signup);
userApi.get("/check-id/:id", checkIdExists);
userApi.get("/check-nickname/:nickname", checkNicknameExists);

export default userApi;
