import { pool } from "../db";
import { convertFullPath } from "./image";

const scheduleDefaultName = "이름없는 스케줄";
const INT_MAX = (1 << 31) * -1 - 1;

const getByteLength = (s) => {
  let b, i, c;
  for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
  return b;
};

const scheduleNameFilter = (name) => {
  if (!name) {
    return { filteredName: null, failMsg: null };
  }
  name = name.trim();
  const bytes = getByteLength(name);
  if (!bytes) {
    name = null;
  } else if (bytes > 30) {
    return { filteredName: null, failMsg: "max byte length is 30" };
  }
  return { filteredName: name, failMsg: null };
};

const checkInsertEvents = (events) => {
  let failMsg = "must be array";
  if (Array.isArray(events)) {
    failMsg = events.length ? null : "must contains at least 1 element";
    for (const event of events) {
      if (typeof event !== "object") {
        return "element must be object";
      }
      const attractionId = Number(event.attractionId);
      const startTime = Number(event.startTime);
      const endTime = Number(event.endTime);
      for (const arg of [attractionId, startTime, endTime]) {
        if (isNaN(arg) || arg < 0 || arg > INT_MAX) {
          return "element's property must be in range 0 ~ 2^31-1";
        }
      }
      if (startTime >= endTime) {
        return "endTime must be later than startTime";
      }
    }
  }
  return failMsg;
};

const executeInsertEvents = async (connection, scheduleId, events) => {
  const query =
    "INSERT INTO schedule_events (schedule_id, attraction_id, start_time, end_time) VALUES (?, ?, ?, ?)";
  for (const event of events) {
    const [ResultSetHeader] = await connection.execute(query, [
      scheduleId,
      event.attractionId,
      event.startTime,
      event.endTime,
    ]);
    console.log(ResultSetHeader.affectedRows);
  }
};

export const getSchedules = async (req, res) => {
  try {
    const uid = req.user.uid;
    var connection = await pool.getConnection();
    const headerQuery = `SELECT s.schedule_id, IFNULL(s.name, ?) name, IFNULL(e.cnt, 0) event_count 
      FROM schedules s LEFT JOIN (SELECT schedule_id, COUNT(*) cnt FROM schedule_events GROUP BY schedule_id) e 
      ON s.schedule_id = e.schedule_id
      WHERE s.user_id = ?
      ORDER BY s.schedule_id`;
    const listQuery = `SELECT * 
      FROM schedule_events e JOIN attractions a 
      ON (e.schedule_id IN (?) AND e.attraction_id = a.attraction_id) 
      ORDER BY e.schedule_id, e.start_time`;
    let [rows] = await connection.execute(headerQuery, [
      scheduleDefaultName,
      uid,
    ]);
    let result = { schedules: rows, events: null };
    if (result.schedules.length > 0) {
      const args = [];
      for (const row of result.schedules) {
        args.push(row.schedule_id);
      }
      [rows] = await connection.query(listQuery, [args]);
      result.events = rows;
      convertFullPath(result.events, "imageSrc");
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const uploadSchedule = async (req, res) => {
  try {
    const { name, events } = req.body;
    const uid = req.user.uid;

    let { filteredName, failMsg } = scheduleNameFilter(name);
    if (failMsg) {
      res.status(400).json({ msg: `Unvalid Arguments 'name' : ${failMsg}` });
      return;
    }
    failMsg = checkInsertEvents(events);
    if (failMsg) {
      res.status(400).json({ msg: `Unvalid Arguments 'events' : ${failMsg}` });
      return;
    }

    //
    //start upload process
    //
    var connection = await pool.getConnection();
    await connection.beginTransaction();
    //insert schedule
    try {
      const query = "INSERT INTO schedules (user_id, name) VALUES (?, ?)";
      const [ResultSetHeader] = await connection.execute(query, [
        uid,
        filteredName,
      ]);
      var scheduleId = ResultSetHeader.insertId.toString();
    } catch (err) {
      console.log(err); //temp code
      res.status(400).json({ msg: "Failure : 1" });
      return;
    }
    //insert schedule's events...
    try {
      await executeInsertEvents(connection, scheduleId, events);
    } catch (err) {
      console.log(err); //temp code
      res.status(400).json({ msg: "Failure on insert events" });
      return;
    }
    connection.commit();
    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.rollback();
      connection.release();
    }
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { name, insertEvents, deleteEvents } = req.body;
    const uid = req.user.uid;
    const sid = req.params.scheduleId;

    let { filteredName, failMsg } = scheduleNameFilter(name);
    if (failMsg) {
      res.status(400).json({ msg: `Unvalid Arguments 'name' : ${failMsg}` });
      return;
    }
    if (insertEvents) {
      failMsg = checkInsertEvents(insertEvents);
      if (failMsg) {
        res
          .status(400)
          .json({ msg: `Unvalid Arguments 'insertEvents' : ${failMsg}` });
        return;
      }
    }
    if (deleteEvents) {
      failMsg = "must be array";
      if (Array.isArray(deleteEvents)) {
        failMsg = deleteEvents.length
          ? null
          : "must contains at least 1 element";
        for (const eventId of deleteEvents) {
          if (typeof eventId !== "string") {
            failMsg = "element must be string";
            break;
          }
        }
        if (failMsg) {
          res
            .status(400)
            .json({ msg: `Unvalid Arguments 'deleteEvents' : ${failMsg}` });
          return;
        }
      }
    }
    if (!filteredName && !insertEvents && !deleteEvents) {
      res.status(400).json({ msg: "require use at least 1 parameter" });
      return;
    }

    //
    //start update process
    //
    var connection = await pool.getConnection();
    connection.beginTransaction();
    //LOCK schedule, and check author
    try {
      const query = "SELECT * FROM schedules WHERE schedule_id = ? FOR UPDATE";
      const [rows] = await connection.execute(query, [sid]);
      if (rows.length === 0) {
        res.status(404).send();
        return;
      }
      //(user_id type int, uid type string)
      if (rows[0].user_id != uid) {
        res.status(400).json({ msg: "Author info mismatch" });
        return;
      }
    } catch (err) {
      //failure case : deadlock
      console.log(err);
      res.status(400).json({ msg: "Failure : 1" });
      return;
    }
    //delete events;
    try {
      const query =
        "DELETE FROM schedule_events WHERE schedule_id = ? AND id = ?";
      if (deleteEvents) {
        for (const eventId of deleteEvents) {
          const [ResultSetHeader] = await connection.execute(query, [
            sid,
            eventId,
          ]);
          console.log(ResultSetHeader.affectedRows);
          if (ResultSetHeader.affectedRows === 0) {
            res.status(400).json({ msg: "Failure on delete events" });
            return;
          }
        }
      }
    } catch (err) {
      //failure case : ??
      console.log(err);
      res.status(400).json({ msg: "Failure : 2" });
      return;
    }
    //insert events
    try {
      if (insertEvents) {
        await executeInsertEvents(connection, sid, insertEvents);
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Failure on insert events" });
      return;
    }
    //update schedule info
    try {
      if (name) {
        const query =
          "UPDATE schedules SET name = ? WHERE schedule_id = ? AND user_id = ?";
        await connection.execute(query, [filteredName, sid, uid]);
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Failure : 3" });
      return;
    }
    connection.commit();
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.rollback();
      connection.release();
    }
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const uid = req.user.uid;
    const sid = req.params.scheduleId;

    //
    //start delete process
    //
    var connection = await pool.getConnection();
    connection.beginTransaction();
    //LOCK schedule, and check author
    try {
      const query = "SELECT * FROM schedules WHERE schedule_id = ? FOR UPDATE";
      const [rows] = await connection.execute(query, [sid]);
      if (rows.length === 0) {
        res.status(404).send();
        return;
      }
      //(user_id type int, uid type string)
      if (rows[0].user_id != uid) {
        res.status(400).json({ msg: "Author info mismatch" });
        return;
      }
    } catch (err) {
      //failure case : deadlock
      console.log(err);
      res.status(400).json({ msg: "Failure : 1" });
      return;
    }
    try {
      const query1 = "DELETE FROM schedule_events WHERE schedule_id = ?";
      const query2 =
        "DELETE FROM schedules WHERE schedule_id = ? AND user_id = ?";
      await connection.execute(query1, [sid]);
      await connection.execute(query2, [sid, uid]);
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "Failure : 2" });
      return;
    }
    connection.commit();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.rollback();
      connection.release();
    }
  }
};
