import express, { Application, NextFunction, Request, Response } from "express";
import { AppRoutes, loginHandler } from "./src";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import { verifyPublicToken, verifyToken } from "./src/auth";
import { rateLimit } from "express-rate-limit";
import requestIp from "request-ip";

const app: Application = express();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.SUPABASE_ANONKEY;
const supabase =
  supabaseUrl && supabaseAnonKey && createClient(supabaseUrl, supabaseAnonKey);

app.use(express.json());
app.use(cors());
app.use(requestIp.mw());

export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 miniutes
  max: 5, // Maximum number of requests
  message: "Too many login attempts. Please try again later.", // Response message for exceeding the limit
  skipSuccessfulRequests: true, // Skip
  keyGenerator: (req: any) => {
    return req.clientIp || req.socket.remoteAddress; // IP address from requestIp.mw(), as opposed to req.ip
  },
});

// LOGIN END POINT WITH RATE LIMITER
app.post("/bedlendule/login", loginRateLimiter, verifyPublicToken, (req, res) =>
  loginHandler(req, res)
);

// Set up multer middleware to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
// UPLOAD IMAGE END POINT
app.post(
  "/uploadImg",
  (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, next);
  },
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // return res.status(200).send("hello")
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
      return res.send(imageUrl);
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
