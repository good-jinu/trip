import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const nonPromisePool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

export const pool = nonPromisePool.promise();

//init refresh_token table
(async () => {
  const conn = await pool.getConnection();
  const q0 = "SET time_zone = '+00:00'";
  const q1 = "DELETE FROM tokens";
  conn.execute(q0);
  await conn.execute(q1);
  conn.release();
  //테스트용으로 5분마다 작동(추후 2시간 간격으로 늘릴것)
  setInterval(checkTokens, 5 * 1 * 60 * 1000);
  console.log("DB connection/init complete");
})();
//set (reset auto_increment & delete expired rows) timer
export const checkTokens = async () => {
  console.log("run checkTokens()...");
  const conn = await pool.getConnection();
  const q1 = "DELETE FROM tokens WHERE exp < now()";
  await conn.execute(q1);
  //FOR DEBUG
  const [rows] = await conn.execute("SELECT * FROM tokens");
  console.log(rows);
  conn.release();
};
