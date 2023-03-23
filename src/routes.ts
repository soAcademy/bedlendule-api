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
} from "./handler";

export const AppRoutes = [
  {
    method: "post",
    path: "/bedlendule/createUser",
    action: createUserHandler,
  },
  {
    method: "post",
    path: "/bedlendule/getUserDetailByUUID",
    action: getUserDetailByUUIDHandler,
  },
  {
    method: "post",
    path: "/bedlendule/updateUser",
    action: updateUserHandler,
  },
  {
    method: "post",
    path: "/bedlendule/createSchedule",
    action: createScheduleHandler,
  },
  {
    method: "post",
    path: "/bedlendule/getAllTimeSlots",
    action: getAllTimeSlotsHandler,
  },
  {
    method: "post",
    path: "/bedlendule/getScheduleByDate",
    action: getScheduleByDateHandler,
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
  },
  {
    method: "post",
    path: "/bedlendule/deleteSchedule",
    action: deleteScheduleHandler,
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
  },
  {
    method: "post",
    path: "/bedlendule/getRequestsByUUID",
    action: getRequestsByUUIDHandler,
  },
  {
    method: "post",
    path: "/bedlendule/acceptRequest",
    action: acceptRequestHandler,
  },
  {
    method: "post",
    path: "/bedlendule/createRequest",
    action: createRequestHandler,
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
  },
];
