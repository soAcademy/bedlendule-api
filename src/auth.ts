import bcrypt from "bcrypt";
// export const genSalt = () => {
//   return crypto
//     .randomBytes(Math.ceil(length / 2))
//     .toString()
//     .slice(0.16);
// };

export const hash = async (password: string) => {
  return bcrypt.hash(password, 10).then((hashedPassword) => hashedPassword);
};

export const validateUser = async (password: any, hash: string) => {
  return bcrypt.compare(password, hash).then((res) => res);
};
