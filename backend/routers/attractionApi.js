import express from "express";
import { auth, checkAuth } from "../auth";
import { deleteAttraction, patchAttraction, postAttraction, search } from "../controllers/attraction";
import { imageUploader } from "../controllers/image";

const attractionApi = express.Router();

//auth : no

//auth : optional
attractionApi.use("/", auth);
attractionApi.get("/search/:mode", search);

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
