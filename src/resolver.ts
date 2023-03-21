import { MeetingTypeEnum, PrismaClient, ProblemTypeEnum } from "@prisma/client";
import {
  IAcceptRequest,
  IBookTimeSlot,
  ICreateRequest,
  ICreateSchedule,
  ICreateUser,
  IDeleteSchedule,
  IGetOpeningRequestsByDate,
  IGetRequestByUUID,
  IGetRequestByRequestId,
  IGetSCheduleByUUID,
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
      background: true,
      profilePictureUrl: true,
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
      title: args.title,
      meetingType: args.meetingType,
      location: args.location,
      timeslots: {
        create: args.timeslots.map((e) => {
          return {
            startTime: new Date(e.startTime),
            finishTime: new Date(e.finishTime),
            price: e.price,
          };
        }),
      },
    },
  });
};

export const getAllTimeSlots = () => {
  return prisma.doctorTimeslot.findMany({
    where: {
      requestId: null,
    },
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
      finishTime: true,
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
                lte: new Date(new Date(args.date).getTime() + 86400000),
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
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
          finishTime: true,
        },
      },
    },
  });
};

export const getScheduleByUUID = (args: IGetSCheduleByUUID) => {
  return prisma.schedule.findMany({
    where: {
      uuid: args.uuid,
    },
    include: {
      timeslots: {
        orderBy: {
          id: 'asc'
        }
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
      title: args.title || undefined,
      meetingType: args.meetingType || undefined,
      location: args.location || undefined,
      timeslots: {
        create: args.addingTimeSlots?.map((e) => {
          return {
            startTime: new Date(e.startTime),
            finishTime: new Date(e.finishTime),
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

export const getOpeningRequests = () => {
  return prisma.request.findMany({
    where: {
      doctorTimeslot: {
        is: null,
      },
    },
    include: {
      doctorTimeslot: true,
    },
  });
};

export const getOpeningRequestsByDate = (args: IGetOpeningRequestsByDate) => {
  return prisma.request.findMany({
    where: {
      doctorTimeslot: {
        is: null,
      },
      startTime: {
        gte: new Date(args.date),
        lte: new Date(new Date(args.date).getTime() + 86400000),
      },
    },
  });
};

export const getRequestByRequestId = (args: IGetRequestByRequestId) => {
  return prisma.request.findFirstOrThrow({
    where: {
      id: args.requestId,
    },
    include: {
      doctorTimeslot: true,
    },
  });
};

export const getRequestsByUUID = (args: IGetRequestByUUID) => {
  return prisma.request.findMany({
    where: {
      patientUUID: args.uuid,
    },
  });
};

export const acceptRequest = async (args: IAcceptRequest) => {
  try {
    const request = await getRequestByRequestId({ requestId: args.requestId });
    if (request.doctorTimeslot === null) {
      return prisma.doctorTimeslot.create({
        data: {
          request: {
            connect: {
              id: args.requestId,
            },
          },
          schedule: {
            create: {
              doctorUUID: {
                connect: {
                  uuid: args.uuid,
                },
              },
              meetingType: request.meetingType,
              location: request.location,
            },
          },
          startTime: new Date(args.startTime),
          finishTime: new Date(args.finishTime),
        },
      });
    } else {
      throw new Error("Invalid request");
    }
  } catch (err) {
    throw new Error("Failed to get request");
  }
};

export const createRequest = (args: ICreateRequest) => {
  return prisma.request.create({
    data: {
      title: args.title,
      description: args.description,
      problemType: args.problemType,
      price: args.price,
      meetingType: args.meetingType,
      location: args.location,
      startTime: new Date(args.startTime),
      finishTime: new Date(args.finishTime),
      patient: {
        connect: {
          uuid: args.patientUUID,
        },
      },
    },
  });
};

export const getDoctors = () => {
  return prisma.user.findMany({
    where: {
      type: "DOCTOR",
    },
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      reviews: {
        select: { score: true },
      },
      background: true,
      profilePictureUrl: true,
    },
  });
};

export const bookTimeSlot = (args: IBookTimeSlot) => {
  return prisma.request.create({
    data: {
      title: "BOOK TIMESLOT",
      description: "Meeting with therapist",
      price: args.price,
      startTime: new Date(args.startTime),
      finishTime: new Date(args.finishTime),
      patient: {
        connect: {
          uuid: args.patientUUID,
        },
      },
      doctorTimeslot: {
        connect: {
          id: args.timeslotId,
        },
      },
      problemType: ProblemTypeEnum.OTHER,
      meetingType: args.meetingType,
      location: args.location,
    },
    include: {
      doctorTimeslot: true,
    },
  });
};
