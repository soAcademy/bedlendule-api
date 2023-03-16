import express, { Application, Request, Response } from "express";

const app = express();
app.use(express.json());

app.listen(5555, () => {
  console.log("Server started on port 5555");
});
