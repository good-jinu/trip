import express from "express";
import { auth } from "../auth";
import {
  signin,
  signup,
  checkIdExists,
  checkNameExists,
  isOnline,
} from "../controllers/user";

const userApi = express.Router();

userApi.post("/login_process", signin);
userApi.post("/signup_process", signup);
userApi.get("/check-id/:id", checkIdExists);
userApi.get("/check-name/:name", checkNameExists);
userApi.get("/isOnline_process", auth, isOnline);

export default userApi;
