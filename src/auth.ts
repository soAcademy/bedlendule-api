import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifySessionCodec } from "./interface";

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

export const verifyJWT = (token: string) => {
  const data = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
  console.log("data", data);
};

export const verifySession = (req: Request, res: Response) => {
  try {
    const token = req.headers["access-token"];
    console.log("token", token);
    if (!token) {
      return res.status(250).json("no-access-token");
    } else {
      const data = jwt.verify(
        token as string,
        process.env.JWT_SECRET as jwt.Secret
      );
      console.log('data', data)
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log(err)
    res.status(250).json(err);
  }
};
