import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifySessionCodec } from "./interface";
import { prisma } from "./resolver";

export const hash = async (password: string) => {
  return bcrypt.hash(password, 10).then((hashedPassword) => hashedPassword);
};

export const validateUser = async (password: any, hash: string) => {
  return bcrypt.compare(password, hash).then((res) => res);
};

export const genJWT = (uuid: string) => {
  const token = jwt.sign({ uuid }, process.env.JWT_SECRET as jwt.Secret, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_SESSION_MINUTE + "m",
  });
  return token;
};

export const genSignUpJWT = () => {
  const token = jwt.sign({ level:"public" }, process.env.JWT_SECRET as jwt.Secret, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_SESSION_MINUTE + "m",
  });
  return token;
};

export const verifyJWT = (token: string) => {
  const data = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
  console.log("data", data);
};

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"];
    console.log("token", token);
    if (!token) {
      return res.status(250).json("no-access-token");
    } else {
      const data: any = jwt.verify(
        token as string,
        process.env.JWT_SECRET as jwt.Secret
      );
      console.log("data", data);
      const type = await prisma.user.findFirst({
        where: {
          uuid: data?.uuid,
        },
        select: {
          type: true,
        },
      });
      next()
      return res.status(200).json({
        ...data,
        type: type?.type,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(250).json(err);
  }
};