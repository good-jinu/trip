import passport from "passport";
import jwt from "jsonwebtoken";

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
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "30 min",
        });
        res.json({ token });
      });
    })(req, res);
  } catch (error) {
    console.error(error);
  }
};

export const signup = async (req, res) => {

};

export const changeUserInfo = async (req, res) => {
  
};

export const deleteUserInfo = async (req, res) => {

};