import express from "express";
import { auth, checkAuth } from "../auth";
import { imageUploader } from "../controllers/image";
import {
  deletePlace,
  postPlace,
  patchPlace,
  search,
} from "../controllers/place";

const placeApi = express.Router();

//auth : no

//auth : optional
placeApi.use("/", auth);
placeApi.get("/search/:mode", search);

//auth : required(level 2)
placeApi.use("/", checkAuth(2));
placeApi.post("/", imageUploader.single("image"), postPlace);
placeApi.patch("/:placeId", imageUploader.single("image"), patchPlace);
placeApi.delete("/:placeId", deletePlace);

export default placeApi;
