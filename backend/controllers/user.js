import passport from "passport";
import jwt from "jsonwebtoken";
import pool from "../db";
import bcrypt from "bcrypt";

export const signin = async (req, res) => {
  try {
    // 아까 local로 등록한 인증과정 실행
    passport.authenticate("local", (passportError, user, info) => {
      // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (passportError || !user) {
        res
          .status(400)
          .json({ message: "ID 또는 Password 정보가 일치하지 않습니다." });
        return;
      }
      // user데이터를 통해 로그인 진행
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          res.send(loginError);
          return;
        }
        console.log(user);
        // 클라이언트에게 JWT생성 후 반환
        const token = jwt.sign(
          { id: user.id, nickname: user.nickname },
          process.env.JWT_SECRET,
          { expiresIn: "30 min" }
        );
        res.json({ token });
      });
    })(req, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { id, password, passwordConfirm, nickname } = req.body;
    //password max length : 72 byte, 현재 핸들링 없음
    if (!id || !password || !nickname || !passwordConfirm) {
      res.status(400).json({ msg: "Unvalid Arguments" });
      return;
    }
    if (password !== passwordConfirm) {
      res.status(400).json({ msg: "Unmatch password & passwordConfirm" });
      return;
    }
    const encodedPassword = bcrypt.hashSync(password, 10);
    try {
      const query =
        "INSERT INTO users (id, password, nickname) VALUES (?, ?, ?);";
      const [ResultSetHeader] = await pool.execute(query, [
        id,
        encodedPassword,
        nickname,
      ]);
      console.log(ResultSetHeader);
    } catch (err) {
      //failure case
      //id 또는 nickname이 중복(unique 속성)
      //각 인자들의 max length 초과
      res.status(400).json({ msg: "Failure" });
      return;
    }
    res.status(201).json({ msg: "Success" });
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

export const checkNicknameExists = async (req, res) => {
  try {
    const { nickname } = req.params;
    if (!nickname) {
      res.status(400).json({ msg: "Unvalid Arguments" });
      return;
    }
    const query = "SELECT * FROM users WHERE nickname = ?";
    const [rows] = await pool.execute(query, [nickname]);
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

// export const changeUserInfo = async (req, res) => {

// };

// export const deleteUserInfo = async (req, res) => {

// };
