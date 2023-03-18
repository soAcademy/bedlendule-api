import { MeetingTypeEnum, ProblemTypeEnum, UserTypeEnum } from "@prisma/client";
import * as t from "io-ts";
import { optional, strict } from "io-ts-extra";

export const createUserCodec = strict({
  type: t.keyof({
    [UserTypeEnum.DOCTOR]: null,
    [UserTypeEnum.USER]: null,
  }),
  uuid: t.string,
  username: t.string,
  password: t.string,
  email: t.string,
  phoneNumber: t.string,
  firstName: t.string,
  lastName: t.string,
});

export interface ICreateUser extends t.TypeOf<typeof createUserCodec> {}

export const getUserDetailByUUIDCodec = t.type({ uuid: t.string });
export interface IGetUserByUUID
  extends t.TypeOf<typeof getUserDetailByUUIDCodec> {}

export const updateUserCodec = strict({
  uuid: t.string,
  email: optional(t.string),
  phoneNumber: optional(t.string),
  licenseId: optional(t.string),
  background: optional(t.string),
  profilePictureUrl: optional(t.string),
});

export interface IUpdateUser extends t.TypeOf<typeof updateUserCodec> {}

export const getScheduleCodec = t.type({ uuid: t.string });
export interface IGetSchedule extends t.TypeOf<typeof getScheduleCodec> {}

export const createScheduleCodec = strict({
  uuid: t.string,
  specialistInfo: t.string,
  meetingType: t.keyof({
    [MeetingTypeEnum.OFFLINE]: null,
    [MeetingTypeEnum.ONLINE]: null,
  }),
  location: optional(t.string),
  timeslots: t.array(
    t.type({
      startTime: t.string,
      finishTime: t.string,
    })
  ),
});
export interface ICreateSchedule extends t.TypeOf<typeof createScheduleCodec> {}

export const getScheduleByDateCodec = t.type({
  uuid: t.string,
  date: t.string,
});
export interface IGetScheduleByDate
  extends t.TypeOf<typeof getScheduleByDateCodec> {}

export const updateScheduleCodec = strict({
  scheduleId: t.number,
  addingTimeSlots: optional(
    t.array(
      t.type({
        startTime: t.string,
        finishTime: t.string,
      })
    )
  ),
  removingTimeSlots: optional(t.array(t.number)),
  specialistInfo: optional(t.string),
  meetingType: optional(
    t.keyof({
      [MeetingTypeEnum.OFFLINE]: null,
      [MeetingTypeEnum.ONLINE]: null,
    })
  ),
  location: optional(t.string),
});

export interface IUpdateSchedule extends t.TypeOf<typeof updateScheduleCodec> {}

export const deleteScheduleCodec = t.type({ scheduleId: t.number });
export interface IDeleteSchedule extends t.TypeOf<typeof deleteScheduleCodec> {}

export const getOpeningRequestsByDateCodec = t.type({
  date: t.string,
});

export interface IGetOpeningRequestsByDate
  extends t.TypeOf<typeof getOpeningRequestsByDateCodec> {}

export const getRequestsByIdCodec = t.type({
  requestId: t.number,
});

export interface IGetRequestsById
  extends t.TypeOf<typeof getRequestsByIdCodec> {}

export const acceptRequestCodec = t.type({
  requestId: t.number,
  uuid: t.string,
  startTime: t.string,
  finishTime: t.string,
});
export interface IAcceptRequest extends t.TypeOf<typeof acceptRequestCodec> {}

export const getRequestByUUIDCodec = t.type({
  uuid: t.string,
});
export interface IGetRequestByUUID
  extends t.TypeOf<typeof getRequestByUUIDCodec> {}

export const createRequestCodec = strict({
  title: t.string,
  description: optional(t.string),
  problemType: t.keyof({
    [ProblemTypeEnum.DEPRESSION]: null,
    [ProblemTypeEnum.MENTAL_HEALTH]: null,
  }),
  price: t.number,
  meetingType: t.keyof({
    [MeetingTypeEnum.OFFLINE]: null,
    [MeetingTypeEnum.ONLINE]: null,
  }),
  location: optional(t.string),
  startTime: t.string,
  finishTime: t.string,
  patientUUID: t.string,
});
export interface ICreateRequest extends t.TypeOf<typeof createRequestCodec> {}

export const getScheduleByUUIDCodec = t.type({
  uuid: t.string,
});

export interface IGetSCheduleByUUID
  extends t.TypeOf<typeof getScheduleByUUIDCodec> {}

export const bookTimeSlotCodec = t.type({
  price: t.number,
  startTime: t.string,
  finishTime: t.string,
  patientUUID: t.string,
  timeslotId: t.number,
  meetingType: t.keyof({
    [MeetingTypeEnum.OFFLINE]:null,
    [MeetingTypeEnum.ONLINE]:null,
  }),
  location: t.string,
});

export interface IBookTimeSlot extends t.TypeOf<typeof bookTimeSlotCodec> {}
