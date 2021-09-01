import { pool } from "../db";

export const getSchedules = async (req, res) => {
  try {
    const uid = req.user.uid;
    var connection = await pool.getConnection();
    const headerQuery = `SELECT s.schedule_id, s.name, IFNULL(e.cnt, 0) event_count 
      FROM schedules s LEFT JOIN (SELECT schedule_id, COUNT(*) cnt FROM schedule_events GROUP BY schedule_id) e 
      ON s.user_id = ? AND s.schedule_id = e.schedule_id 
      ORDER BY s.schedule_id`;
    const listQuery = `SELECT * 
      FROM schedule_events e JOIN attractions a 
      ON (e.schedule_id IN (?) AND e.attraction_id = a.attraction_id) 
      ORDER BY e.schedule_id, e.start_time`;
    let [rows] = await connection.execute(headerQuery, [uid]);
    let result = { header: rows, events: null };
    const args = [];
    for (const row of result.header) {
      args.push(row.schedule_id);
    }
    [rows] = await connection.query(listQuery, [args]);
    result.events = rows;
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

export const postSchedule = async (req, res) => {
  try {
    var { name, events } = req.body;
    const uid = req.user.uid;
    //check arguments : name
    if (!name || name.trim() === "") {
      name = null;
    }
    //check arguments : events
    console.log(events);
    let failMsg = "must be array";
    if (Array.isArray(events)) {
      failMsg = events.length ? null : "must contains at least 1 element";
      for (const event of events) {
        if (typeof event !== "object") {
          failMsg = "element must be object";
          break;
        }
        const attractionId = Number(event.attractionId);
        const startTime = Number(event.startTime);
        const endTime = Number(event.endTime);
        if (isNaN(attractionId)) {
          failMsg = "attractionId is not number";
          break;
        }
        if (isNaN(startTime)) {
          failMsg = "startTime is not number";
          break;
        }
        if (isNaN(endTime)) {
          failMsg = "endTime is not number";
          break;
        }
        if (startTime <= Math.floor(Date.now() / 1000)) {
          failMsg = "startTime must be later than current time";
          break;
        }
        if (startTime >= endTime) {
          failMsg = "endTime must be later than startTime";
          break;
        }
      }
    }
    if (failMsg) {
      res.status(400).json({ msg: `Unvalid Arguments 'events' : ${failMsg}` });
      return;
    }

    //
    //start upload process
    //
    var connection = await pool.getConnection();
    //insert schedule
    try {
      const query = "INSERT INTO schedules (user_id, name) VALUES (?, ?)";
      const ResultSetHeader = await connection.execute(query, [uid, name]);
      var scheduleId = ResultSetHeader[0].insertId.toString();
    } catch (err) {
      console.log(err); //temp code
      res.status(400).json({ msg: "Failure : 1" });
      return;
    }
    //insert schedule's events...
    try {
      const query =
        "INSERT INTO schedule_events (schedule_id, attraction_id, start_time, end_time) VALUES (?, ?, ?, ?)";
      for (const event of events) {
        const ResultSetHeader = await connection.execute(query, [
          scheduleId,
          event.attractionId,
          event.startTime,
          event.endTime,
        ]);
        console.log(ResultSetHeader[0]);
      }
    } catch (err) {
      console.log(err); //temp code
      res.status(400).json({ msg: "Failure : 2" });
      //remove already inserted rows
      if (scheduleId) {
        const query1 = "DELETE FROM schedule_events WHERE schedule_id = ?";
        const query2 = "DELETE FROM schedules WHERE schedule_id = ?";
        connection.execute(query1, [scheduleId]);
        connection.execute(query2, [scheduleId]);
      }
      return;
    }
    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
