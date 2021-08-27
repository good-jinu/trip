import express from "express";
import { auth, checkAuth } from "../auth";
import {
  deleteAttraction,
  getAttractionInfo,
  getAttractionList,
  patchAttraction,
  postAttraction,
  search,
} from "../controllers/attraction";
import { imageUploader } from "../controllers/image";

const attractionApi = express.Router();

//auth : no
attractionApi.get("/info/:attractionId", getAttractionInfo, search);
attractionApi.get("/list/:placeId", getAttractionList, search);

//auth : optional
attractionApi.use("/", auth);

//auth : required(level 2)
attractionApi.use("/", checkAuth(2));
attractionApi.post("/:placeId", imageUploader.single("image"), postAttraction);
attractionApi.patch(
  "/:attractionId",
  imageUploader.single("image"),
  patchAttraction
);
attractionApi.delete("/:attractionId", deleteAttraction);

export default attractionApi;
