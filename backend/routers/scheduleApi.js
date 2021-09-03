import express from "express";
import { auth, checkAuth } from "../auth";
import {
  deleteSchedule,
  getSchedules,
  updateSchedule,
  uploadSchedule,
} from "../controllers/schedule";
const scheduleApi = express.Router();

//auth : no

//auth : optional
scheduleApi.use("/", auth);

//auth : required(level 1)
scheduleApi.use("/", checkAuth(1));
scheduleApi.get("/", getSchedules);
scheduleApi.post("/upload", uploadSchedule);
scheduleApi.post("/update/:scheduleId", updateSchedule);
scheduleApi.delete("/:scheduleId", deleteSchedule);

export default scheduleApi;
