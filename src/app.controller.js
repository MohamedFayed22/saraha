import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config({ path: resolve("config/.env") });
import express from "express";
import checkConnection from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import cors from "cors";
const app = express();
const port = process.env.PORT;

const bootstrap = () => {
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  checkConnection();

  app.use("/users", userRouter);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "welcome to new app!" });
  });

  app.use("{/*demo}", (req, res) => {
    res.status(404).json({ message: `URL ${req.originalUrl} not found` });
  });

  app.use((err, req, res, next) => {
    res.status(err.cause || 500).json({
      message: err.message,
      stack: err.stack,
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default bootstrap;
