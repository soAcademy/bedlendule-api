import { verifySession } from "./auth";
import {
  acceptRequestHandler,
  bookTimeSlotHandler,
  createRequestHandler,
  createScheduleHandler,
  createUserHandler,
  deleteScheduleHandler,
  getDoctorsHandler,
  getOpeningRequestsByDateHandler,
  getOpeningRequestsHandler,
  getRequestByRequestIdHandler,
  getRequestsByUUIDHandler,
  getScheduleByDateHandler,
  getScheduleByUUIDHandler,
  getAllTimeSlotsHandler,
  getUserDetailByUUIDHandler,
  updateScheduleHandler,
  updateUserHandler,
  getScheduleByDateAndUUIDHandler,
  createReviewHandler,
  deleteRequestHandler,
  chooseDoctorHandler,
  loginHandler,
  getPublicTokenHandler,
} from "./handler";

export const AppRoutes = [
  {
    method: "post",
    path: "/bedlendule/createUser",
    action: createUserHandler,  
  },
  {
    method: "post",
    path: "/bedlendule/getPublicToken",
    action: getPublicTokenHandler,  
  },
  {
    method: "post",
    path: "/bedlendule/login",
    action: loginHandler,
  },
  // {
  //   method: "post",
  //   path: "/bedlendule/verifySession",
  //   action: verifySession,
  // },
  {
    method: "post",
    path: "/bedlendule/getUserDetailByUUID",
    action: getUserDetailByUUIDHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/updateUser",
    action: updateUserHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/createSchedule",
    action: createScheduleHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/getAllTimeSlots",
    action: getAllTimeSlotsHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/getScheduleByDate",
    action: getScheduleByDateHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/getScheduleByDateAndUUID",
    action: getScheduleByDateAndUUIDHandler,
  },
  {
    method: "post",
    path: "/bedlendule/getScheduleByUUID",
    action: getScheduleByUUIDHandler,
  },
  {
    method: "post",
    path: "/bedlendule/updateSchedule",
    action: updateScheduleHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/deleteSchedule",
    action: deleteScheduleHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/getOpeningRequests",
    action: getOpeningRequestsHandler,
  },
  {
    method: "post",
    path: "/bedlendule/getOpeningRequestsByDate",
    action: getOpeningRequestsByDateHandler,
  },
  {
    method: "post",
    path: "/bedlendule/getRequestByRequestId",
    action: getRequestByRequestIdHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/getRequestsByUUID",
    action: getRequestsByUUIDHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/acceptRequest",
    action: acceptRequestHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/createRequest",
    action: createRequestHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/deleteRequest",
    action: deleteRequestHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/getDoctors",
    action: getDoctorsHandler,
  },
  {
    method: "post",
    path: "/bedlendule/bookTimeSlot",
    action: bookTimeSlotHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/createReview",
    action: createReviewHandler,
    middleware: verifySession
  },
  {
    method: "post",
    path: "/bedlendule/chooseDoctor",
    action: chooseDoctorHandler,
    middleware: verifySession
  },
];
