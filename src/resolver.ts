import { PrismaClient } from "@prisma/client";
import {
  ICreateSchedule,
  ICreateUser,
  IDeleteSchedule,
  IGetSchedule,
  IGetScheduleByDate,
  IGetUserByUUID,
  IUpdateSchedule,
  IUpdateUser,
} from "./interface";
export const prisma = new PrismaClient();

export const createUser = (args: ICreateUser) => {
  return prisma.user.create({
    data: args,
  });
};

export const getUserDetailByUUID = (args: IGetUserByUUID) => {
  return prisma.user.findFirstOrThrow({
    where: {
      uuid: args.uuid,
    },
    select: {
      username: true,
      email: true,
      phoneNumber: true,
      firstName: true,
      lastName: true,
      licenseId: true,
      reviews: {
        select: {
          id: true,
          review: true,
          score: true,
        },
      },
    },
  });
};

export const updateUser = (args: IUpdateUser) => {
  return prisma.user.update({
    where: {
      uuid: args.uuid,
    },
    data: {
      email: args.email || undefined,
      phoneNumber: args.phoneNumber || undefined,
      licenseId: args.licenseId || undefined,
      background: args.background || undefined,
      profilePictureUrl: args.profilePictureUrl || undefined,
    },
  });
};

export const createSchedule = (args: ICreateSchedule) => {
  return prisma.schedule.create({
    data: {
      uuid: args.uuid,
      specialistInfo: args.specialistInfo,
      meetingType: args.meetingType,
      location: args.location,
      timeslots: {
        create: args.timeslots.map((e) => {
          return {
            startTime: new Date(e.startTime),
            finishTIme: new Date(e.finishTime),
          };
        }),
      },
    },
  });
};

export const getSchedule = (args: IGetSchedule) => {
  return prisma.user.findFirstOrThrow({
    where: {
      uuid: args.uuid,
    },
    include: {
      schedules: {
        select: {
          id: true,
          specialistInfo: true,
          meetingType: true,
          location: true,
          timeslots: {
            select: {
              id: true,
              request: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  problemType: true,
                  meetingType: true,
                  location: true,
                  startTime: true,
                  finishTime: true,
                },
              },
              startTime: true,
              finishTIme: true,
            },
          },
        },
      },
    },
  });
};

export const getScheduleByDate = (args: IGetScheduleByDate) => {
  return prisma.schedule.findMany({
    where: {
      AND: [
        { uuid: args.uuid },
        {
          timeslots: {
            some: {
              startTime: {
                gte: new Date(args.date),
              },
              finishTIme: {
                lte: new Date(new Date(args.date).getTime() + 86400000),
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      specialistInfo: true,
      timeslots: {
        select: {
          id: true,
          request: {
            select: {
              id: true,
              title: true,
              description: true,
              problemType: true,
              meetingType: true,
              location: true,
              startTime: true,
              finishTime: true,
            },
          },
          startTime: true,
          finishTIme: true,
        },
      },
    },
  });
};

export const getOpeningRequests = () => {
  return prisma.request.findMany({
    where: {
      doctorTimeslot: {
        is: null,
      },
    },
  });
};

export const updateSchedule = async (args: IUpdateSchedule) => {
  return prisma.schedule.update({
    where: {
      id: args.scheduleId,
    },
    data: {
      specialistInfo: args.specialistInfo || undefined,
      meetingType: args.meetingType || undefined,
      location: args.location || undefined,
      timeslots: {
        create: args.addingTimeSlots?.map((e) => {
          return {
            startTime: new Date(e.startTime),
            finishTIme: new Date(e.finishTime),
          };
        }),
        delete: args.removingTimeSlots?.map((e) => {
          return {
            id: e,
          };
        }),
      },
    },
  });
};

export const deleteSchedule = async (args: IDeleteSchedule) => {
  await prisma.schedule.update({
    where: {
      id: args.scheduleId,
    },
    data: {
      timeslots: {
        deleteMany: {
          scheduleId: args.scheduleId,
        },
      },
    },
  });
  return prisma.schedule.delete({
    where: {
      id: args.scheduleId,
    },
  });
};
