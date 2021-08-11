import passport from "passport";
import localStrategy from "passport-local";
import bcrypt from "bcrypt";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import pool from "./db";

const passportConfig = {
  usernameField: "id",
  passwordField: "password",
};

const passportVerify = async (userId, password, done) => {
  try {
    console.log(`try login : ${userId} : ${password}`);
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await pool.execute(query, [userId]);
    if (rows.length === 0) {
      done(null, false);
      return;
    }
    const compareResult = bcrypt.compareSync(
      password,
      rows[0].password.toString()
    );
    if (compareResult) {
      done(null, rows[0]);
      return;
    }
    done(null, false);
  } catch (err) {
    console.log(err);
    done(err);
  }
};

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.JWT_SECRET,
};
const JWTVerify = async (jwtPayload, done) => {
  try {
    const query = "SELECT * FROM users WHERE user_id = ?";
    const [rows] = await pool.execute(query, [jwtPayload.id]);
    if (rows.length === 0) {
      done(null, false);
      return;
    }
    done(null, rows[0]);
  } catch (error) {
    console.error(error);
    done(error);
  }
};

passport.use("local", new localStrategy(passportConfig, passportVerify));
passport.use("jwt", new JWTStrategy(JWTConfig, JWTVerify));

export const auth = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (user) {
      req.user = user;
      console.log(user);
    }
    next();
  })(req, res, next);
};

export const checkAuth = (requireLevel) => {
  return async (req, res, next) => {
    if (req.user) {
      if (req.user.authority_level >= requireLevel) {
        next();
      } else {
        res.status(403).send();
      }
    } else {
      res.status(401).send();
    }
  };
};
