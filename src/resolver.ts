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
  IGetUserByUUID,
  IUpdateSchedule,
  IUpdateUser,
  IGetScheduleByDateAndUUID,
  IGetScheduleByDate,
  ICreateReview,
  IDeleteRequest,
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
      uuid: true,
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
      schedules: {
        select: {
          timeslots: true,
          description: true,
          location: true,
          meetingType: true,
          title: true,
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
      title: args.title,
      meetingType: args.meetingType,
      location: args.location,
      description: args.description,
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
    include: {
      timeslots: {
        select: {
          id: true,
          startTime: true,
          finishTime: true,
          price: true,
        },
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

export const getScheduleByDateAndUUID = (args: IGetScheduleByDateAndUUID) => {
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
        orderBy: {
          startTime: "asc",
        },
      },
    },
  });
};

export const getScheduleByDate = (args: IGetScheduleByDate) => {
  return prisma.schedule.findMany({
    where: {
      timeslots: {
        some: {
          startTime: {
            gte: new Date(args.date),
            lte: new Date(new Date(args.date).getTime() + 86400000),
          },
        },
      },
    },
    select: {
      doctorUUID: {
        select: {
          firstName: true,
          lastName: true,
          reviews: true,
          uuid: true,
        },
      },
      id: true,
      description: true,
      meetingType: true,
      timeslots: {
        select: {
          id: true,
          requestId: true,
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
        select: {
          id: true,
          price: true,
          startTime: true,
          finishTime: true,
          request: {
            select: {
              patient: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "asc",
        },
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
            price: e.price,
          };
        }),
        delete: args.removingTimeSlots?.map((e) => {
          return {
            id: e,
          };
        }),
      },
    },
    include: {
      timeslots: {
        select: {
          id: true,
          requestId: true,
          scheduleId: true,
          startTime: true,
          finishTime: true,
          price: true,
        },
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
    include: {
      doctorTimeslot: true,
      review: true,
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
              description: "Accept Request",
              title: "Patient Request",
            },
          },
          startTime: new Date(args.startTime),
          finishTime: new Date(args.finishTime),
          price: request.price,
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

export const deleteRequest = (args: IDeleteRequest) => {
  return prisma.request.delete({
    where: {
      id: args.id,
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

export const createReview = (args: ICreateReview) => {
  return prisma.request.update({
    where: {
      id: args.requestId,
    },
    data: {
      doctorTimeslot: {
        update: {
          schedule: {
            update: {
              doctorUUID: {
                update: {
                  reviews: {
                    create: {
                      score: args.score,
                      review: args.review,
                      request: {
                        connect: {
                          id: args.requestId,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};
