import express, { Application, NextFunction, Request, Response } from "express";
import { AppRoutes } from "./src";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors({
  allowedHeaders:['Content-Type', 'Authorization'],
  credentials:true,
  origin:"*",
  methods:["POST","GET"],
  optionsSuccessStatus:200,
  exposedHeaders:['Content-Type', 'Authorization']
}));

AppRoutes.map((route) => {
  app[route.method as keyof Application](
    route.path,
    (req: Request, res: Response, next: NextFunction) => {
      if (route.middleware) {
        route.middleware(req, res, next);
      } else {
        next();
      }
    },
    (req: Request, res: Response) => route.action(req, res)
  );
});

app.listen(5555, () => {
  console.log("Server started on port 5555");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});
