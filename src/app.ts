import express from "express";
import cors from "cors";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { BaseRouter } from "./app/routes";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3000/login",
      "http://localhost:5000",
    ],
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
