import express from "express";
import cors from "cors";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { BaseRouter } from "./app/routes";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://masjid-management-gules.vercel.app",
  "http://localhost:3000",
  "https://masjid-management-gules.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  }),
);

//  Routes
app.use("/api", BaseRouter);

app.get("/", (req, res) => {
  res.send("Server running successfully!");
});

app.use(globalErrorHandler);

app.use(notFoundHandler);

export default app;
