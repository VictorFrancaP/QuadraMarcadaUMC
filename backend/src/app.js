import express from "express";
import { routes } from "./routes.js";
import cors from "cors";
import "dotenv/config.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(routes);
app.use("/uploads", express.static("uploads"));

export { app };
