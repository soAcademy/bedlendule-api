import express, { Application, Request, Response } from "express";
import { AppRoutes } from "./src";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
  })
);

AppRoutes.map((route) => {
  app[route.method as keyof Application](
    route.path,
    (req: Request, res: Response) => route.action(req, res)
  );
});

app.listen(5555, () => {
  console.log("Server started on port 5555");
});
