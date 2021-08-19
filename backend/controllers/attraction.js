import { pool } from "../db";
import { defaultImageName, imageRoutingPath, removeImage } from "./image";
import { join } from "path";

export const search = async (req, res) => {
  try {
    const { query, args } = createSearchQuery(req);
    if (!query) {
      res.status(400).json({ msg: "Unsupported mode value" });
      return;
    }
    for (const arg of args) {
      if (!arg) {
        res.status(400).json({ msg: "Unvalid Arguments" });
        return;
      }
    }
    const [rows] = await pool.execute(query, args);
    const length = rows.length;
    for (let i = 0; i < length; ++i) {
      const filename = rows[i].imageSrc ? rows[i].imageSrc : defaultImageName;
      rows[i].imageSrc = join(imageRoutingPath, filename);
    }
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const createSearchQuery = (req) => {
  const { mode } = req.params;
  const { placeId, attractionId } = req.query;
  if (mode === "0") {
    //search by placeId, simple results
    return {
      query:
        "SELECT attraction_id, name, imageSrc FROM attractions WHERE place_id = ?;",
      args: [placeId],
    };
  } else if (mode === "1") {
    //search by attractionId, full results
    return {
      query: "SELECT * FROM attractions WHERE attraction_id = ?;",
      args: [attractionId],
    };
  }
  return {};
};

//require use 'auth', 'checkAuth' middleware on all below functions

export const postAttraction = async (req, res) => {
  try {
    let { name, description, imageCopyright } = req.body;
    const { placeId } = req.params;
    if (!name) {
      res.status(400).json({ msg: "Unvalid Arguments" });
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
    const query =
      "INSERT INTO attractions (place_id, name, description, imageSrc, imageCopyright) VALUES (?, ?, ?, ?, ?);";
    try {
      await pool.execute(query, [
        placeId,
        name,
        description,
        filename,
        imageCopyright,
      ]);
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

export const patchAttraction = async (req, res) => {
  try {
    const { attractionId } = req.params;
    const selectQuery = "SELECT * FROM attractions WHERE attraction_id = ?;";
    const updateQuery =
      "UPDATE attractions SET name = ?, description = ?, imageSrc = ?, imageCopyright = ? WHERE attraction_id = ?;";
    var connection = await pool.getConnection();
    let [rows] = await connection.execute(selectQuery, [attractionId]);
    if (rows.length === 0) {
      res.status(404).json({ msg: "attraction NOT FOUND" });
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
        attractionId,
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

export const deleteAttraction = async (req, res) => {
  try {
    const { attractionId } = req.params;
    const selectQuery =
      "SELECT imageSrc FROM attractions WHERE attraction_id = ?;";
    const deleteQuery = "DELETE FROM attractions WHERE attraction_id = ?;";
    var connection = await pool.getConnection();
    let [rows] = await connection.execute(selectQuery, [attractionId]);
    if (rows.length === 0) {
      res.status(404).json({ msg: "attraction NOT FOUND" });
      return;
    }
    removeImage(rows[0].imageSrc);
    try {
      await connection.execute(deleteQuery, [attractionId]);
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
