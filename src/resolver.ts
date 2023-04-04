import {
  MeetingTypeEnum,
  PrismaClient,
  ProblemTypeEnum,
  RequestStatus,
} from "@prisma/client";
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
  IChooseDoctor,
  ILogin,
} from "./interface";
import { genJWT, genSignUpJWT, validateUser, verifyJWT } from "./auth";
export const prisma = new PrismaClient();

export const createUser = (args: ICreateUser) => {
  return prisma.user.create({
    data: args,
  });
};

export const login = async (args: ILogin) => {
  const authenticated = await validateUser(args.password, args.hashedPassword);
  if (authenticated) {
    return {
      access_token: genJWT(args.uuid),
      uuid: args.uuid,
    };
  } else {
    throw new Error("Password is incorrect");
  }
};

export const getPublicToken = async () => {
  return {
    access_token: genSignUpJWT(),
  };
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
      type:true,
      background: true,
      profilePictureUrl: true,
      schedules: {
        select: {
          timeslots: {
            select: {
              id: true,
              startTime: true,
              finishTime: true,
              price: true,
              request: {
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          },
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
    select: {
      email: true,
      phoneNumber: true,
      licenseId: true,
      background: true,
      profilePictureUrl: true,
    },
  });
};

export const createSchedule = (args: ICreateSchedule) => {
  console.log(args);
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
            doctor: {
              connect: {
                uuid: args.uuid,
              },
            },
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
      location: true,
      meetingType: true,
      description: true,
      timeslots: {
        select: {
          price: true,
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
      doctor: {
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
              status: true,
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
  try {
    const schedule = await prisma.schedule.findFirstOrThrow({
      where: {
        id: args.scheduleId,
        uuid: args.uuid,
      },
    });
    if (schedule.title !== "Patient Request") {
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
                doctor: {
                  connect: {
                    uuid: args.uuid,
                  },
                },
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
    } else {
      throw new Error("Invalid Request");
    }
  } catch (err) {
    throw err;
  }
};

export const deleteSchedule = async (args: IDeleteSchedule) => {
  try {
    await prisma.schedule.findFirstOrThrow({
      where: {
        id: args.scheduleId,
        uuid: args.uuid,
      },
    });
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
  } catch (err) {
    throw err;
  }
};

export const getOpeningRequests = () => {
  return prisma.request.findMany({
    where: {
      status: {
        not: RequestStatus.CHOSEN,
      },
      startTime: {
        gte: new Date(),
      },
    },
    include: {
      doctorTimeslot: {
        select: {
          schedule: {
            select: {
              uuid: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const getOpeningRequestsByDate = (args: IGetOpeningRequestsByDate) => {
  return prisma.request.findMany({
    where: {
      status: {
        not: RequestStatus.CHOSEN,
      },
      startTime: {
        gte: new Date(args.date),
        lte: new Date(new Date(args.date).getTime() + 86400000),
      },
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      doctorTimeslot: {
        select: {
          schedule: {
            select: {
              uuid: true,
            },
          },
        },
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
      doctorTimeslot: {
        include: {
          schedule: {
            select: {
              uuid: true,
            },
          },
        },
      },
    },
  });
};

export const getRequestsByUUID = async (args: IGetRequestByUUID) => {
  try {
    const result = await prisma.request.findMany({
      where: {
        patientUUID: args.uuid,
      },
      include: {
        doctorTimeslot: {
          include: {
            schedule: {
              include: {
                doctor: {
                  select: {
                    uuid: true,
                    firstName: true,
                    lastName: true,
                    background: true,
                    reviews: true,
                  },
                },
              },
            },
          },
        },
        review: true,
      },
    });
    return result?.map((i) => ({
      ...i,
      doctorTimeslot: i.doctorTimeslot.map((e) => ({
        id: e.id,
        doctorUUID: e.schedule.doctor.uuid,
        firstName: e.schedule.doctor.firstName,
        lastName: e.schedule.doctor.lastName,
        background: e.schedule.doctor.background,
        reviewScore:
          e.schedule.doctor.reviews.reduce((acc, r) => acc + r.score, 0) /
          e.schedule.doctor.reviews.length,
      })),
    }));
  } catch (err) {
    throw new Error("Failed to get request");
  }
};

export const acceptRequest = async (args: IAcceptRequest) => {
  try {
    const request = await getRequestByRequestId({ requestId: args.requestId });
    if (
      request.status !== RequestStatus.CHOSEN &&
      request.doctorTimeslot.findIndex(
        (timeslot) => timeslot.schedule.uuid === args.uuid
      ) === -1
    ) {
      await prisma.request.update({
        where: { id: args.requestId },
        data: {
          status: "ACCEPTED",
        },
      });
      const result = await prisma.doctorTimeslot.create({
        data: {
          request: {
            connect: {
              id: args.requestId,
            },
          },
          schedule: {
            create: {
              doctor: {
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
          doctor: {
            connect: {
              uuid: args.uuid,
            },
          },
          startTime: new Date(args.startTime),
          finishTime: new Date(args.finishTime),
          price: request.price,
        },
      });
      return result;
    } else {
      console.log("invalid");
      throw new Error("Invalid request");
    }
  } catch (err) {
    throw new Error("Invalid Request");
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
          uuid: args.uuid,
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
          uuid: args.uuid,
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
      status: "CHOSEN",
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
          where: {
            id: args.timeSlotId,
          },
          data: {
            schedule: {
              update: {
                doctor: {
                  update: {
                    reviews: {
                      upsert: {
                        where: {
                          requestId: args.requestId,
                        },
                        create: {
                          score: args.score,
                          review: args.review,
                          request: {
                            connect: {
                              id: args.requestId,
                            },
                          },
                        },
                        update: {
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
      },
    },
  });
};

export const chooseDoctor = async (args: IChooseDoctor) => {
  try {
    const timeSlotsToBeDeleted = await prisma.doctorTimeslot.findMany({
      where: {
        requestId: args.requestId,
        id: {
          not: args.timeSlotId,
        },
      },
    });

    const deletedTimeslots = timeSlotsToBeDeleted.map(async (e) => {
      await prisma.schedule.update({
        where: {
          id: e.scheduleId,
        },
        data: {
          timeslots: {
            deleteMany: {
              scheduleId: e.scheduleId,
            },
          },
        },
      });
    });
    const deletedSchedules = await prisma.schedule.deleteMany({
      where: {
        id: {
          in: timeSlotsToBeDeleted.map((e) => e.scheduleId),
        },
      },
    });

    const updatedRequest = await prisma.request.update({
      where: {
        id: args.requestId,
      },
      data: {
        status: RequestStatus.CHOSEN,
      },
    });
    return {
      deletedTimeslots,
      deletedSchedules,
      updatedRequest,
    };
  } catch (err) {
    throw new Error("Failed to get request");
  }
};
