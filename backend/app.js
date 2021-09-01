import createError from "http-errors";
import express from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "./auth";
import indexRouter from "./routers/index";
import passport from "passport";
import userApi from "./routers/userApi";
import placeApi from "./routers/placeApi";
import { imageStorePath, imageRoutingPath } from "./controllers/image";
import attractionApi from "./routers/attractionApi";
import scheduleApi from "./routers/scheduleApi";

const app = express();

app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(join(__dirname, "../client/build")));
app.use(imageRoutingPath, express.static(imageStorePath));

app.use("/", indexRouter);
app.use("/", userApi);
app.use("/place", placeApi);
app.use("/attraction", attractionApi);
app.use("/schedule", scheduleApi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
