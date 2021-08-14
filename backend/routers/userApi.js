import express from "express";
import { auth, checkAuth } from "../auth";
import {
  signin,
  signup,
  checkIdExists,
  checkNameExists,
  refresh,
  logout,
} from "../controllers/user";

const userApi = express.Router();

userApi.post("/login_process", signin);
userApi.post("/signup_process", signup);
userApi.get("/check-id/:id", checkIdExists);
userApi.get("/check-name/:name", checkNameExists);
userApi.post("/refresh", refresh);
userApi.post("/logout", logout);

export default userApi;
