import multer from "multer";
import { nanoid } from "nanoid";
import { join } from "path";
import fs from "fs";

export const imageStorePath = join(__dirname, "../../image");
export const imageRoutingPath = "/img";
export const defaultImageName = "default.png";

//summary
//storage path : {imageStorePath}
//file name : {random 21 bytes}.{file's ext}
//allow only .jpg & .png
//file max size : 5MB
export const imageUploader = multer({
  storage: multer.diskStorage({
    destination: imageStorePath,
    filename: (req, file, cb) => {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, `${nanoid()}.${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const removeImage = (file) => {
  try {
    if (!file) return;
    var filename = typeof file === "string" ? file : file.filename;
    if (filename === defaultImageName) return;
    const target = join(imageStorePath, filename);
    fs.unlinkSync(target);
    console.log(`Success to removeFile : ${filename}`);
  } catch (err) {
    console.log(`Failed to removeFile : ${filename}\nerror : ${err}`);
  }
};

export const convertFullPath = (arr, keyname) => {
  const length = arr.length;
  for (let i = 0; i < length; ++i) {
    const filename = arr[i][keyname] ? arr[i][keyname] : defaultImageName;
    arr[i][keyname] = join(imageRoutingPath, filename);
  }
};