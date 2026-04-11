import express from "express";
import cors from "cors";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { BaseRouter } from "./app/routes";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://masjid-management-gules.vercel.app",
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   }),
// );


app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://masjid-management-gules.vercel.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


//  Routes
app.use("/api", BaseRouter);

app.get("/", (req, res) => {
  res.send("Server running successfully!");
});

app.use(globalErrorHandler);

app.use(notFoundHandler);

export default app;
