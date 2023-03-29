import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
