import express, { Application, NextFunction, Request, Response } from "express";
import { AppRoutes } from "./src";
import cors from "cors";
const app = express();
app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     optionsSuccessStatus: 200,
//   })
// );
app.options('*', cors({
  origin: "*",
  optionsSuccessStatus: 200,
}));

AppRoutes.map((route) => {
  app[route.method as keyof Application](
    route.path,
    (req: Request, res: Response, next: NextFunction) => {
      route.middleware && route.middleware(req, res, next);
      return next();
    },
    (req: Request, res: Response, next: NextFunction) =>
      route.action(req, res, next)
  );
});

app.listen(5555, () => {
  console.log("Server started on port 5555");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});
