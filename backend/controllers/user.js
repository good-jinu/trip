import passport from "passport";
import jwt from "jsonwebtoken";
import pool from "../db";
import bcrypt from "bcrypt";

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
      // user데이터를 통해 로그인 진행
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          res.send(loginError);
          return;
        }
        // 클라이언트에게 JWT생성 후 반환
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
          expiresIn: "30m",
        });
        res.status(200).json({ sessionToken: token, name: user.name });
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
      const [ResultSetHeader] = await pool.execute(query, [
        id,
        encodedPassword,
        name,
      ]);
      console.log(ResultSetHeader);
    } catch (err) {
      //failure case
      //id 또는 nickname이 중복(unique 속성)
      //각 인자들의 max length 초과
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

export const isOnline = async (req, res) => {
  //require use 'auth' middleware
  if (!req.user) {
    res.status(200).json({ isOnline: false });
  } else {
    res.status(200).json({
      isOnline: true,
      name: req.user.name,
      authority_level: req.user.authority_level,
    });
  }
};

// export const changeUserInfo = async (req, res) => {

// };

// export const deleteUserInfo = async (req, res) => {

// };
