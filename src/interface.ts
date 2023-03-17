import { UserTypeEnum } from "@prisma/client";
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

export const createScheduleCodec = t.type({
  uuid: t.string,
  specialistInfo: t.string,
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
