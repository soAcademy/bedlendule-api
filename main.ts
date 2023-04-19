import express, { Application, NextFunction, Request, Response } from "express";
import { AppRoutes, loginHandler } from "./src";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import { verifyPublicToken, verifyToken } from "./src/auth";
import requestIp from "request-ip";
import {
  IRateLimiterRedisOptions,
  RateLimiterRedis,
} from "rate-limiter-flexible";
import Redis from "ioredis";
import { array } from "fp-ts";

const app: Application = express();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.SUPABASE_ANONKEY;
const supabase =
  supabaseUrl && supabaseAnonKey && createClient(supabaseUrl, supabaseAnonKey);

app.use(express.json());
app.use(
  cors({
    exposedHeaders: [
      "X-RateLimit-Limit",
      "X-Ratelimit-Remaining",
      "X-Ratelimit-Reset",
      "Retry-After",
    ],
  })
);
app.use(requestIp.mw());

const redis_url:string = process.env.REDIS_HOST_URL || '127.0.0.1:5555';
const [host, port] = redis_url.split(":");
const redisClient = new Redis({
  port: +port,
  host: host,
  password: process.env.REDIS_PASSWORD,
  enableOfflineQueue: false,
});

const MAX_REQUEST_LIMIT = 5;
const MAX_REQUEST_WINDOW = 0; // No Expire
const TOO_MANY_REQUESTS_MESSAGE = "Too many requests";

const opts: IRateLimiterRedisOptions = {
  storeClient: redisClient,
  points: MAX_REQUEST_LIMIT, // 5 points
  duration: MAX_REQUEST_WINDOW, // Per 15 minutes
  blockDuration: 5 * 60, // block for 5 minutes if more than points consumed
  inMemoryBlockDuration: 5 * 60,
  inMemoryBlockOnConsumed: 5,
};
export const rateLimiter = new RateLimiterRedis(opts);

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  rateLimiter
    .consume((req.clientIp as string) || (req.socket.remoteAddress as string))
    .then((rateLimiterRes) => {
      console.log(rateLimiterRes);
      res.setHeader("Retry-After", rateLimiterRes.msBeforeNext / 1000);
      res.setHeader("X-RateLimit-Limit", MAX_REQUEST_LIMIT);
      res.setHeader("X-RateLimit-Remaining", rateLimiterRes.remainingPoints);
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString()
      );
      next();
    })
    .catch((err) => {
      res.setHeader("Retry-After", err.msBeforeNext / 1000);
      res.setHeader("X-RateLimit-Remaining", err.remainingPoints);
      res.status(429).json({ message: TOO_MANY_REQUESTS_MESSAGE });
      console.log("err", err);
    });
};

app.post(
  "/bedlendule/login",
  rateLimiterMiddleware,
  verifyPublicToken,
  (req, res) => loginHandler(req, res)
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
