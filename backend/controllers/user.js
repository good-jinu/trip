import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { pool, checkTokens } from "../db";

const createTokens = async (user, conn) => {
  try {
    const tid = nanoid();
    //exp : 1 hour
    const jwt_exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const db_exp = new Date(jwt_exp * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const query = "INSERT INTO tokens (tid, user_id, exp) VALUES (?, ?, ?);";
    await conn.execute(query, [tid, user.user_id, db_exp]);

    const accessToken = jwt.sign(
      { id: user.id, name: user.name, al: user.authority_level },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { tid: tid, exp: jwt_exp },
      process.env.JWT_SECRET
    );
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (err) {
    console.log("Warnning : Failed to createToken");
    checkTokens();
    throw err;
  }
};

export const signin = async (req, res) => {
  try {
    // 아까 local로 등록한 인증과정 실행
    // eslint-disable-next-line no-unused-vars
    passport.authenticate("local", (passportError, user, info) => {
      // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (passportError || !user) {
        res
          .status(400)
          .json({ msg: "ID 또는 Password 정보가 일치하지 않습니다." });
        return;
      }
      req.login(user, { session: false }, async (loginError) => {
        if (loginError) {
          res.send(loginError);
          return;
        }
        const tokens = await createTokens(user, user.conn);
        res.status(200).json(tokens);
      });
    })(req, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { id, password, name } = req.body;
    //password max length : 72 byte, 현재 핸들링 없음
    if (!id || !password || !name) {
      res.status(400).json({ msg: "Unvalid Arguments" });
      return;
    }
    const encodedPassword = bcrypt.hashSync(password, 10);
    try {
      const query = "INSERT INTO users (id, password, name) VALUES (?, ?, ?);";
      await pool.execute(query, [id, encodedPassword, name]);
    } catch (err) {
      //failure case
      //db datatype이랑 입력값 미일치
      res.status(400).json({ msg: "Failure" });
      return;
    }
    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const checkIdExists = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ msg: "Unvalid Arguments" });
      return;
    }
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await pool.execute(query, [id]);
    if (rows.length === 0) {
      res.status(200).json({ isExist: false });
      return;
    }
    res.status(200).json({ isExist: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const checkNameExists = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      res.status(400).json({ msg: "Unvalid Arguments" });
      return;
    }
    const query = "SELECT * FROM users WHERE name = ?";
    const [rows] = await pool.execute(query, [name]);
    if (rows.length === 0) {
      res.status(200).json({ isExist: false });
      return;
    }
    res.status(200).json({ isExist: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).send();
      return;
    }
    var refreshPayload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    res.status(400).send();
    return;
  }
  try {
    var connection = await pool.getConnection();
    const selectQuery =
      "SELECT u.*, t.valid valid FROM users u JOIN tokens t ON (t.tid = ? AND u.user_id = t.user_id);";
    const validCaseQuery = "UPDATE tokens SET valid = 0 WHERE (tid = ?);";
    const unvalidCaseQuery = "DELETE FROM tokens WHERE (user_id = ?);";
    const [rows] = await connection.execute(selectQuery, [refreshPayload.tid]);
    const user = rows[0];
    if (!user) {
      res.status(401).send();
      return;
    }
    if (user.valid) {
      await connection.execute(validCaseQuery, [refreshPayload.tid]);
      const tokens = await createTokens(user, connection);
      res.status(200).json(tokens);
    } else {
      await connection.execute(unvalidCaseQuery, [user.user_id]);
      console.log(`Reuse refreshToken : Forced logout id = ${user.id}`);
      res.status(401).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).send();
      return;
    }
    var refreshPayload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    res.status(400).send();
    return;
  }
  try {
    //아래 쿼리 : 토큰을 블랙리스트에 등록
    //const query = "UPDATE tokens SET valid = 0 WHERE tid = ? AND valid = 1;";
    //아래 쿼리 : 토큰을 관리리스트에서 삭제
    const query = "DELETE FROM tokens WHERE tid = ? AND valid = 1;";

    const [ResultSetHeader] = await pool.execute(query, [refreshPayload.tid]);
    if (ResultSetHeader.affectedRows) {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// export const changeUserInfo = async (req, res) => {

// };

// export const deleteUser = async (req, res) => {

// };
