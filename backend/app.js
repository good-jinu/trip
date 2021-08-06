import createError from "http-errors";
import express from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "./auth";
import indexRouter from "./routers/index";
import passport from "passport";
import userApi from "./routers/userapi";

const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "../client/build")));

app.use("/", indexRouter);
app.use("/api", userApi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
