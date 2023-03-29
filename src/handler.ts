import { Request, Response } from "express";
import {
  acceptRequestCodec,
  bookTimeSlotCodec,
  chooseDoctorCodec,
  createRequestCodec,
  createReviewCodec,
  createScheduleCodec,
  createUserCodec,
  deleteRequestCodec,
  deleteScheduleCodec,
  getOpeningRequestsByDateCodec,
  getRequestByRequestIdCodec,
  getRequestsByUUIDCodec,
  getScheduleByDateAndUUIDCodec,
  getScheduleByDateCodec,
  getScheduleByUUIDCodec,
  getScheduleCodec,
  getUserDetailByUUIDCodec,
  loginCodec,
  updateScheduleCodec,
  updateUserCodec,
} from "./interface";
import {
  acceptRequest,
  bookTimeSlot,
  createRequest,
  createSchedule,
  createUser,
  deleteSchedule,
  getDoctors,
  getOpeningRequests,
  getOpeningRequestsByDate,
  getRequestByRequestId,
  getRequestsByUUID,
  getScheduleByDate,
  getScheduleByUUID,
  getAllTimeSlots,
  getUserDetailByUUID,
  updateSchedule,
  updateUser,
  getScheduleByDateAndUUID,
  createReview,
  deleteRequest,
  chooseDoctor,
  login,
} from "./resolver";
import { v4 as uuidv4 } from "uuid";
import { hash } from "./auth";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (createUserCodec.decode(body)._tag === "Right") {
      const uuid = uuidv4();
      const password = await hash(body.password);
      return createUser({ ...body, uuid, password })
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (loginCodec.decode(body)._tag === "Right") {
      const idExist = await prisma.user.findFirst({
        where: {
          username: body.username,
        },
        select: {
          password: true,
        },
      });
      if (idExist) {
        return login({
          hashedPassword: idExist.password,
          password: body.password,
        })
          .then((response) =>
            response
              ? res.status(200).json(response)
              : res.status(401).json(response)
          )
          .catch((err) => res.status(500).send(err));
      } else {
        return res.json({
          status: 401,
          message: "Username or password is incorrect",
        });
      }
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUserDetailByUUIDHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (getUserDetailByUUIDCodec.decode(body)._tag === "Right") {
      return getUserDetailByUUID(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateUserHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (updateUserCodec.decode(body)._tag === "Right") {
      return updateUser(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createScheduleHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (createScheduleCodec.decode(body)._tag === "Right") {
      return createSchedule(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAllTimeSlotsHandler = (req: Request, res: Response) => {
  try {
    return getAllTimeSlots()
      .then((response) => res.status(200).json(response))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getScheduleByDateHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (getScheduleByDateCodec.decode(body)._tag === "Right") {
      return getScheduleByDate(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getScheduleByDateAndUUIDHandler = (
  req: Request,
  res: Response
) => {
  try {
    const body = req?.body;
    if (getScheduleByDateAndUUIDCodec.decode(body)._tag === "Right") {
      return getScheduleByDateAndUUID(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getScheduleByUUIDHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (getScheduleByUUIDCodec.decode(body)._tag === "Right") {
      return getScheduleByUUID(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateScheduleHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (updateScheduleCodec.decode(body)._tag === "Right") {
      return updateSchedule(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteScheduleHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (deleteScheduleCodec.decode(body)._tag === "Right") {
      return deleteSchedule(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getOpeningRequestsHandler = (req: Request, res: Response) => {
  try {
    return getOpeningRequests()
      .then((response) => res.status(200).json(response))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getOpeningRequestsByDateHandler = (
  req: Request,
  res: Response
) => {
  try {
    const body = req?.body;
    if (getOpeningRequestsByDateCodec.decode(body)._tag === "Right") {
      return getOpeningRequestsByDate(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getRequestByRequestIdHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (getRequestByRequestIdCodec.decode(body)._tag === "Right") {
      return getRequestByRequestId(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getRequestsByUUIDHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (getRequestsByUUIDCodec.decode(body)._tag === "Right") {
      return getRequestsByUUID(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const acceptRequestHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (acceptRequestCodec.decode(body)._tag === "Right") {
      return acceptRequest(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createRequestHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (createRequestCodec.decode(body)._tag === "Right") {
      return createRequest(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteRequestHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (deleteRequestCodec.decode(body)._tag === "Right") {
      return deleteRequest(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getDoctorsHandler = (req: Request, res: Response) => {
  try {
    return getDoctors()
      .then((response) => res.status(200).json(response))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).json(err);
  }
};

export const bookTimeSlotHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (bookTimeSlotCodec.decode(body)._tag === "Right") {
      return bookTimeSlot(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createReviewHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (createReviewCodec.decode(body)._tag === "Right") {
      return createReview(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const chooseDoctorHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (chooseDoctorCodec.decode(body)._tag === "Right") {
      return chooseDoctor(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
