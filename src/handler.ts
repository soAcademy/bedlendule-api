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
  verifySessionCodec,
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
  prisma,
  getPublicToken,
} from "./resolver";
import { v4 as uuidv4 } from "uuid";
import { hash, verifyJWT } from "./auth";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (createUserCodec.decode(body)._tag === "Right") {
      const uuid = uuidv4();
      const password = await hash(body.password);
      return createUser({
        ...body,
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        firstName: body.firstName.toLowerCase(),
        lastName: body.lastName.toLowerCase(),
        uuid,
        password,
      })
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPublicTokenHandler = async (req: Request, res: Response) => {
  try {
    return getPublicToken()
      .then((response) => res.status(200).json(response))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).json(err);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const body = req?.body;
    if (loginCodec.decode(body)._tag === "Right") {
      const userData = await prisma.user.findFirst({
        where: {
          username: body.username,
        },
        select: {
          password: true,
          uuid: true,
          type: true,
        },
      });
      if (userData) {
        return login({
          hashedPassword: userData.password,
          password: body.password,
          uuid: userData.uuid,
          type: userData.type,
        })
          .then((response) => res.status(200).json(response))
          .catch((err) => res.status(500).send(err));
      } else {
        return res.status(500).send("Username or password is incorrect");
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
    return "";
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateUserHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const inputData = { ...body, uuid };
    if (updateUserCodec.decode(inputData)._tag === "Right") {
      return updateUser(inputData)
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
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const inputData = { ...body, uuid };
    if (createScheduleCodec.decode(inputData)._tag === "Right") {
      return createSchedule(inputData)
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
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const inputData = { ...body, uuid };
    if (updateScheduleCodec.decode(inputData)._tag === "Right") {
      return updateSchedule(inputData)
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
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const inputData = { ...body, uuid };
    if (deleteScheduleCodec.decode(inputData)._tag === "Right") {
      return deleteSchedule(inputData)
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
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const inputData = { uuid };
    if (getRequestsByUUIDCodec.decode(inputData)._tag === "Right") {
      return getRequestsByUUID(inputData)
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
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const inputData = { ...body, uuid };
    if (acceptRequestCodec.decode(inputData)._tag === "Right") {
      return acceptRequest(inputData)
        .then((response) => res.status(200).json(response))
        .catch((err) => {
          console.log(err)
          res.status(400).json("Invalid Request");
        });
    } else {
      res.status(400).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createRequestHandler = (req: Request, res: Response) => {
  try {
    const body = req?.body;
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const inputData = { ...body, uuid };
    if (createRequestCodec.decode(inputData)._tag === "Right") {
      return createRequest(inputData)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteRequestHandler = async (req: Request, res: Response) => {
  try {
    const body = req?.body;
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const request = await getRequestByRequestId({ requestId: body.id });

    if (
      deleteRequestCodec.decode(body)._tag === "Right" &&
      request.patientUUID === uuid
    ) {
      return deleteRequest(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(400).send("Invalid Request");
    }
  } catch (err) {
    res.status(400).send("Invalid Request");
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
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const inputData = { ...body, uuid };
    if (bookTimeSlotCodec.decode(inputData)._tag === "Right") {
      return bookTimeSlot(inputData)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Failed To Validate Codec");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createReviewHandler = async (req: Request, res: Response) => {
  try {
    const body = req?.body;
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const request = await getRequestByRequestId({ requestId: body.requestId });
    if (
      createReviewCodec.decode(body)._tag === "Right" &&
      request.patientUUID === uuid
    ) {
      return createReview(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(400).send("Invalid Request");
    }
  } catch (err) {
    res.status(400).json("Invalid Request");
  }
};

export const chooseDoctorHandler = async (req: Request, res: Response) => {
  try {
    const body = req?.body;
    const token: any = req?.headers["authorization"];
    const { uuid }: any = verifyJWT(token);
    const request = await getRequestByRequestId({ requestId: body.requestId });
    if (
      chooseDoctorCodec.decode(body)._tag === "Right" &&
      request.patientUUID === uuid
    ) {
      return chooseDoctor(body)
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(500).send("Invalid Request");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
