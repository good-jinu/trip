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
(async (pool) => {
  const q1 = "DROP TABLE IF EXISTS tokens;";
  const q2 = `CREATE TABLE tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tid CHAR(21) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    valid TINYINT(1) DEFAULT 1,
    exp DATETIME NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
  await pool.execute(q1);
  pool.execute(q2);
})(pool);
//set (reset auto_increment & delete expired rows) timer
export const checkTokens = async (pool) => {
  console.log("run checkTokens()...");
  const q1 = "DELETE FROM tokens WHERE exp < now();";
  const q2 = "ALTER TABLE tokens AUTO_INCREMENT = 1;";
  await pool.execute(q1);
  await pool.execute(q2);
  //FOR DEBUG
  const [rows] = await pool.execute("SELECT * FROM tokens;");
  console.log(rows);
};
//테스트용으로 1분마다 작동(추후 2시간 간격으로 늘릴것)
setInterval(checkTokens, 1 * 1 * 60 * 1000, pool);
