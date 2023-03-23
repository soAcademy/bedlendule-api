import { MeetingTypeEnum, ProblemTypeEnum, UserTypeEnum } from "@prisma/client";
import * as t from "io-ts";
import { optional, strict } from "io-ts-extra";

export const createUserCodec = strict({
  type: t.keyof({
    [UserTypeEnum.DOCTOR]: null,
    [UserTypeEnum.PATIENT]: null,
  }),
  username: t.string,
  password: t.string,
  email: t.string,
  phoneNumber: t.string,
  firstName: t.string,
  lastName: t.string,
});

export interface ICreateUser extends t.TypeOf<typeof createUserCodec> {
  uuid: string;
}

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
  title: t.string,
  description: t.string,
  meetingType: t.keyof({
    [MeetingTypeEnum.OFFLINE]: null,
    [MeetingTypeEnum.ONLINE]: null,
  }),
  location: optional(t.string),
  timeslots: t.array(
    t.type({
      startTime: t.string,
      finishTime: t.string,
      price: t.number,
    })
  ),
});
export interface ICreateSchedule extends t.TypeOf<typeof createScheduleCodec> {}

export const getScheduleByDateCodec = t.type({
  date: t.string,
});
export interface IGetScheduleByDate
  extends t.TypeOf<typeof getScheduleByDateCodec> {}

export const getScheduleByDateAndUUIDCodec = t.type({
  uuid: t.string,
  date: t.string,
});
export interface IGetScheduleByDateAndUUID
  extends t.TypeOf<typeof getScheduleByDateAndUUIDCodec> {}

export const getScheduleByUUIDCodec = t.type({
  uuid: t.string,
});

export interface IGetSCheduleByUUID
  extends t.TypeOf<typeof getScheduleByUUIDCodec> {}

export const updateScheduleCodec = strict({
  scheduleId: t.number,
  addingTimeSlots: optional(
    t.array(
      t.type({
        startTime: t.string,
        finishTime: t.string,
        price: t.number,
      })
    )
  ),
  removingTimeSlots: optional(t.array(t.number)),
  title: optional(t.string),
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

export const getRequestByRequestIdCodec = t.type({
  requestId: t.number,
});

export interface IGetRequestByRequestId
  extends t.TypeOf<typeof getRequestByRequestIdCodec> {}

export const acceptRequestCodec = t.type({
  requestId: t.number,
  uuid: t.string,
  startTime: t.string,
  finishTime: t.string,
});
export interface IAcceptRequest extends t.TypeOf<typeof acceptRequestCodec> {}

export const getRequestsByUUIDCodec = t.type({
  uuid: t.string,
});
export interface IGetRequestByUUID
  extends t.TypeOf<typeof getRequestsByUUIDCodec> {}

export const createRequestCodec = strict({
  title: t.string,
  description: optional(t.string),
  problemType: t.keyof({
    [ProblemTypeEnum.DEPRESSION]: null,
    [ProblemTypeEnum.BIPOLAR]: null,
    [ProblemTypeEnum.DEMENTIA]: null,
    [ProblemTypeEnum.SCHIZOPHRENIA]: null,
    [ProblemTypeEnum.PANIC_DISORDER]: null,
    [ProblemTypeEnum.MENTAL_HEALTH]: null,
    [ProblemTypeEnum.POST_TRAUMATIC_STRESS_DISORDER]: null,
    [ProblemTypeEnum.PHOBIAS]: null,
    [ProblemTypeEnum.OTHER]: null,
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

export const bookTimeSlotCodec = t.type({
  price: t.number,
  startTime: t.string,
  finishTime: t.string,
  patientUUID: t.string,
  timeslotId: t.number,
  meetingType: t.keyof({
    [MeetingTypeEnum.OFFLINE]: null,
    [MeetingTypeEnum.ONLINE]: null,
  }),
  location: t.string,
});

export interface IBookTimeSlot extends t.TypeOf<typeof bookTimeSlotCodec> {}

export const createReviewCodec = strict({
  requestId: t.number,
  score: t.number,
  review: optional(t.string),
});

export interface ICreateReview extends t.TypeOf<typeof createReviewCodec> {}
