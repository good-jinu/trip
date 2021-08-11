import pool from "../db";
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
    let { name, description } = req.body;
    if (!name) {
      res.status(400).json({ msg: "Unvalid Arguments : name" });
      removeImage(req.file);
      return;
    }
    if (!description) {
      description = "";
    }
    const filename = req.file ? req.file.filename : defaultImageName;
    try {
      const query =
        "INSERT INTO places (name, description, imageSrc) VALUES (?, ?, ?);";
      const [ResultSetHeader] = await pool.execute(query, [
        name,
        description,
        filename,
      ]);
      console.log(ResultSetHeader);
    } catch (err) {
      //failure case
      //name 중복
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

export const putPlace = async (req, res) => {
  try {

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
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
    if (rows[0].imageSrc !== defaultImageName) {
      removeImage(rows[0].imageSrc);
    }
    try {
      const [ResultSetHeader] = await connection.execute(deleteQuery, [
        rows[0].place_id,
      ]);
      console.log(ResultSetHeader);
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
    console.log("deleteplace finally");
    if (connection) {
      connection.release();
    }
  }
};
