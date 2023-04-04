import express, { Application, NextFunction, Request, Response } from "express";
import { AppRoutes } from "./src";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import { verifyToken } from "./src/auth";
const app: Application = express();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.SUPABASE_ANONKEY;
const supabase =
  supabaseUrl && supabaseAnonKey && createClient(supabaseUrl, supabaseAnonKey);

// Set up multer middleware to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);
// UPLOAD IMAGE END POINT
app.post(
  "/uploadImg",
  // (req: Request, res: Response, next: NextFunction) => {
  //   verifyToken(req, res, next);
  // },
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    console.log("req?.files", req.file);
    const file = req.file;
    const fileExt = file?.originalname.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    const fileBuffer = file.buffer;
    if (supabase) {
      const { data, error: uploadError } = await supabase.storage
        .from("profile-picture")
        .upload(filePath, fileBuffer);

      if (uploadError) {
        throw uploadError;
      }

      const url = await supabase.storage
        .from("profile-picture")
        .getPublicUrl(data.path);
      const imageUrl = url.data.publicUrl;
      res.send(imageUrl);
    }
  }
);

AppRoutes.map((route) => {
  app[route.method as keyof Application](
    route.path,
    (req: Request, res: Response, next: NextFunction) => {
      if (route.middleware) {
        route.middleware(req, res, next);
      } else {
        return next();
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
