import express, { Application } from "express";
import cors from "cors";
import { BaseRouter } from "./app/routers";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api", BaseRouter);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
