import express from "express";
import { auth, checkAuth } from "../auth";
import { imageUploader } from "../controllers/image";
import {
  deletePlace,
  getPlace,
  postPlace,
  putPlace,
} from "../controllers/place";

const placeApi = express.Router();

//auth : no

//auth : optional
placeApi.use("/", auth);
placeApi.get("/:place", getPlace);

//auth : required(level 1)
placeApi.use("/", checkAuth(1));
placeApi.post("/", imageUploader.single("image"), postPlace);
placeApi.put("/:place", putPlace);
placeApi.delete("/:place", deletePlace);

export default placeApi;
