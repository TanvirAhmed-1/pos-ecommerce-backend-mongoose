// import express, { Application } from "express";
// import cors from "cors";
// import { BaseRouter } from "./app/routers";
// import globalErrorHandler from "./app/middlewares/globalErrorHandler";
// import notFound from "./app/middlewares/notFound";

// const app: Application = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api", BaseRouter);

// app.get("/", (req, res) => {
//   res.send("server is running");
// });

// app.use(globalErrorHandler);
// app.use(notFound);
// export default app;

import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { BaseRouter } from "./app/routers";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application Routes
app.use("/api", BaseRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running! 🏃‍♂️");
});

// Middlewares for Error Handling (এগুলো অবশ্যই রাউটের নিচে থাকবে)
app.use(globalErrorHandler);
app.use(notFound);

export default app;