import { pool } from "../db";
import { convertFullPath, removeImage } from "./image";

export const search = async (req, res) => {
  try {
    var [rows] = await pool.execute(req.queryStr, req.queryArgs);
  } catch (err) {
    res.status(400).json({ msg: "Failure" });
    return;
  }
  try {
    convertFullPath(rows, "imageSrc");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getPlaceByName = async (req, res, next) => {
  const { place } = req.params;
  req.queryStr =
    "SELECT p.*, IFNULL(a.c, 0) attractionCount FROM places p LEFT JOIN (SELECT place_id, COUNT(*) c FROM attractions GROUP BY place_id) a ON p.place_id = a.place_id WHERE p.name = ?;";
  req.queryArgs = [place];
  next();
};

export const getPlaceList = async (req, res, next) => {
  let { page } = req.query;
  page = !page ? 1 : Number(page);
  if (isNaN(page)) {
    res.status(400).send();
    return;
  }
  const index = ((page - 1) * 20).toString();
  req.queryStr = "SELECT name, place_id, imageSrc FROM places LIMIT ?, 20";
  req.queryArgs = [index];
  next();
};

export const getPlaceCount = async (req, res) => {
  try {
    const query = "SELECT COUNT(*) cnt FROM places;";
    const [rows] = await pool.execute(query);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//require use 'auth', 'checkAuth' middleware on all below functions

export const postPlace = async (req, res) => {
  try {
    let { name, description, imageCopyright } = req.body;
    if (!name) {
      res.status(400).json({ msg: "Unvalid Arguments : name" });
      removeImage(req.file);
      return;
    }
    if (!description) {
      description = "";
    }
    if (!imageCopyright) {
      imageCopyright = "";
    }
    const filename = req.file ? req.file.filename : null;
    try {
      const query =
        "INSERT INTO places (name, description, imageSrc, imageCopyright) VALUES (?, ?, ?, ?);";
      await pool.execute(query, [name, description, filename, imageCopyright]);
    } catch (err) {
      //failure case
      //db datatype이랑 입력값 미일치
      res.status(400).json({ msg: "Failure" });
      removeImage(req.file);
      return;
    }
    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
    removeImage(req.file);
  }
};

export const patchPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const selectQuery = "SELECT * FROM places WHERE place_id = ?;";
    const updateQuery =
      "UPDATE places SET name = ?, description = ?, imageSrc = ?, imageCopyright = ? WHERE place_id = ?;";
    var connection = await pool.getConnection();
    let [rows] = await connection.execute(selectQuery, [placeId]);
    if (rows.length === 0) {
      res.status(404).json({ msg: "place NOT FOUND" });
      removeImage(req.file);
      return;
    }
    const oldImageSrc = rows[0].imageSrc;
    const name = req.body.name ? req.body.name : rows[0].name;
    const description = req.body.description
      ? req.body.description
      : rows[0].description;
    const imageSrc = req.file ? req.file.filename : oldImageSrc;
    const imageCopyright = req.body.imageCopyright
      ? req.body.imageCopyright
      : rows[0].imageCopyright;
    try {
      await connection.execute(updateQuery, [
        name,
        description,
        imageSrc,
        imageCopyright,
        placeId,
      ]);
    } catch (err) {
      //failure case
      //db datatype이랑 입력값 미일치
      res.status(400).json({ msg: "Failure" });
      removeImage(req.file);
      return;
    }
    res.status(200).send();
    if (oldImageSrc !== imageSrc) {
      removeImage(oldImageSrc);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
    removeImage(req.file);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const deletePlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const selectQuery = "SELECT imageSrc FROM places WHERE place_id = ?;";
    const deleteQuery = "DELETE FROM places WHERE place_id = ?;";
    var connection = await pool.getConnection();
    let [rows] = await connection.execute(selectQuery, [placeId]);
    if (rows.length === 0) {
      res.status(404).json({ msg: "place NOT FOUND" });
      return;
    }
    removeImage(rows[0].imageSrc);
    try {
      await connection.execute(deleteQuery, [placeId]);
    } catch (err) {
      //failure case : ??
      res.status(400).json({ msg: "Failure" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
