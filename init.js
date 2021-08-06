import dotenv from "dotenv";
import "./backend/db";
import app from "./backend/app";

dotenv.config();

const PORT = process.env.PORT;

const handleListening = () =>
  console.log(`✔ Server running: http://localhost:${PORT}`);

app.listen(PORT, handleListening);