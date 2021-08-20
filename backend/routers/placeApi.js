import express from "express";
import { auth, checkAuth } from "../auth";
import { imageUploader } from "../controllers/image";
import {
  deletePlace,
  postPlace,
  patchPlace,
  search,
  getPlaceByName,
  getPlaceList,
  getPlaceCount,
} from "../controllers/place";

const placeApi = express.Router();

//auth : no
placeApi.get("/count", getPlaceCount);
placeApi.get("/info/:place", getPlaceByName, search);
placeApi.get("/list", getPlaceList, search);

//auth : optional
placeApi.use("/", auth);

//auth : required(level 2)
placeApi.use("/", checkAuth(2));
placeApi.post("/", imageUploader.single("image"), postPlace);
placeApi.patch("/:placeId", imageUploader.single("image"), patchPlace);
placeApi.delete("/:placeId", deletePlace);

export default placeApi;
