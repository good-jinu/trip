import { pool } from "../db";
import { defaultImageName, imageRoutingPath, removeImage } from "./image";
import { join } from "path";

export const getPlace = async (req, res) => {
  try {
    const { place } = req.params;
    const query = "SELECT * FROM places WHERE name = ?;";
    let [rows] = await pool.execute(query, [place]);
    if (rows.length === 0) {
      res.status(404).json({ msg: "place NOT FOUND" });
      return;
    }
    const filename = rows[0].imageSrc ? rows[0].imageSrc : defaultImageName;
    rows[0].imageSrc = join(imageRoutingPath, filename);
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
    const { place } = req.params;
    const selectQuery = "SELECT * FROM places WHERE name = ?;";
    const updateQuery =
      "UPDATE places SET name = ?, description = ?, imageSrc = ?, imageCopyright = ? WHERE place_id = ?;";
    var connection = await pool.getConnection();
    let [rows] = await connection.execute(selectQuery, [place]);
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
        rows[0].place_id,
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
    const { place } = req.params;
    const selectQuery = "SELECT place_id, imageSrc FROM places WHERE name = ?;";
    const deleteQuery = "DELETE FROM places WHERE place_id = ?;";
    var connection = await pool.getConnection();
    let [rows] = await connection.execute(selectQuery, [place]);
    if (rows.length === 0) {
      res.status(404).json({ msg: "place NOT FOUND" });
      return;
    }
    removeImage(rows[0].imageSrc);
    try {
      await connection.execute(deleteQuery, [rows[0].place_id]);
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
