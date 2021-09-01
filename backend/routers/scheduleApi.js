import express from "express";
import { auth, checkAuth } from "../auth";
import { getSchedules, postSchedule } from "../controllers/schedule";
const scheduleApi = express.Router();

//auth : no

//auth : optional
scheduleApi.use("/", auth);

//auth : required(level 1)
scheduleApi.use("/", checkAuth(1));
scheduleApi.get("/", getSchedules);
scheduleApi.post("/", postSchedule);

export default scheduleApi;
