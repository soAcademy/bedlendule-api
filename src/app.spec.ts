import { MeetingTypeEnum, ProblemTypeEnum, UserTypeEnum } from "@prisma/client";
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
  getAllTimeSlots,
  getScheduleByDate,
  getScheduleByUUID,
  getUserDetailByUUID,
  updateSchedule,
  updateUser,
} from "./resolver";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { createRequestCodec } from "./interface";
import * as t from "io-ts";

const prisma = new PrismaClient();

describe("BEDLENDULE", () => {
  let uuid: string;
  test("createUser", async () => {
    const data = {
      type: [UserTypeEnum.DOCTOR, UserTypeEnum.USER][
        Math.floor(Math.random() * 2)
      ],
      uuid: uuid,
      username: "testuser1" + new Date().getTime(),
      password: "testpassword",
      email: "testemail" + new Date().getTime() + "@gmail.com",
      phoneNumber: "012" + new Date().getTime(),
      firstName: "Test",
      lastName: "User",
    };
    const result = await createUser(data);
    // console.log("createUser", result);
  });
  test("getUserDetailByUUID", async () => {
    const result = await getUserDetailByUUID({ uuid });
    // console.log("result", result);
  });

  test("updateUser", async () => {
    const data = {
      uuid,
      email: "UpdatedEmail" + new Date().getTime(),
      licenseId: "TEST-LIC-01" + new Date().getTime(),
    };
    const result = await updateUser(data);
    // console.log("updateUser", result);
  });

  test("createSchedule", async () => {
    const startTime = new Date().getTime() + 86400000;
    const finishTime = startTime + 3600000;
    const data = {
      uuid: "f641413d-3924-416b-a727-3286d75cfb56",
      specialistInfo: "Psychologist",
      meetingType: MeetingTypeEnum.ONLINE,
      timeslots: [
        {
          startTime: new Date(startTime).toLocaleString(),
          finishTime: new Date(finishTime).toLocaleString(),
          price: 600,
        },
        {
          startTime: new Date(startTime + 7200000).toLocaleString(),
          finishTime: new Date(finishTime + 10800000).toLocaleString(),
          price: 600,
        },
      ],
    };
    const result = await createSchedule(data);
    // console.log("createSchedule", result);
  });

  test("getAllTimeSlots", async () => {
    const result = await getAllTimeSlots();
    // console.log("getSchedule", result);
  });

  test("getScheduleByDate", async () => {
    const data = {
      uuid: "f641413d-3924-416b-a727-3286d75cfb56",
      date: new Date(new Date().getTime() + 86400000).toLocaleDateString(),
    };
    const result = await getScheduleByDate(data);
    // console.log("getScheduleByDate", result);
  });

  test("getScheduleByUUID", async () => {
    const uuid = "f641413d-3924-416b-a727-3286d75cfb56";
    const result = await getScheduleByUUID({ uuid });
    console.log("getScheduleByUUID", result);
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ uuid: uuid })])
    );
  });

  test("updateSchedule", async () => {
    const data = {
      scheduleId: 3,
      specialistInfo: "Mental Health Therapist",
      meetingType: MeetingTypeEnum.OFFLINE,
      addingTimeSlots: [
        {
          startTime: new Date(new Date().getTime() + 86400000).toLocaleString(),
          finishTime: new Date(
            new Date().getTime() + 90000000
          ).toLocaleString(),
        },
        {
          startTime: new Date(new Date().getTime() + 90000000).toLocaleString(),
          finishTime: new Date(
            new Date().getTime() + 93600000
          ).toLocaleString(),
        },
      ],
    };
    const result = await updateSchedule(data);
    // console.log("updateSchedule", result);
  });
  // test("deleteSchedule", async () => {
  //   const result = await deleteSchedule({ scheduleId: 5 });
  //   console.log("deleteSchedule", result);
  // });
});

describe("createRequest", () => {
  it("should create a request with the given arguments", async () => {
    const requestArgs = {
      title: "Example Request",
      description: "This is an example request",
      problemType: ProblemTypeEnum.DEPRESSION,
      price: 50,
      meetingType: MeetingTypeEnum.ONLINE,
      startTime: "2023-03-22T09:00:00Z",
      finishTime: "2023-03-22T10:00:00Z",
      patientUUID: "b3a84e07-9be6-4b4b-8abc-c6346d52824d",
    };

    const createdRequest = await createRequest(requestArgs);

    expect(createdRequest.title).toBe(requestArgs.title);
    expect(createdRequest.description).toBe(requestArgs.description);
    expect(createdRequest.price).toBe(requestArgs.price);
    expect(createdRequest.patientUUID).toBe(requestArgs.patientUUID);
  });

  it("should throw an error if the given arguments are invalid", async () => {
    const invalidRequestArgs: t.TypeOf<typeof createRequestCodec> = {
      title: "Example Request",
      description: "This is an example request",
      problemType: ProblemTypeEnum.DEPRESSION,
      price: 50,
      meetingType: MeetingTypeEnum.OFFLINE,
      startTime: "invalid-date-time",
      finishTime: "invalid-date-time",
      patientUUID: "ba797dc5-75d1-4a48-bc54-f5e45d53c02b",
    };

    await expect(createRequest(invalidRequestArgs)).rejects.toThrow();
  });
});

describe("getOpeningRequests", () => {
  test("should return all requests with doctorTimeslot = null", async () => {
    const result = await getOpeningRequests();
    // console.log("getOpeningRequests", result);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ doctorTimeslot: null }),
      ])
    );
  });
});

describe("getOpeningRequestsByDate", () => {
  test("should return all requests with doctorTimeslot:null, startTime and finishTime are in the selected date", async () => {
    const dateString = "3/20/2023";
    const result = await getOpeningRequestsByDate({ date: dateString });
    // console.log("getOpeningRequestsByDate", result);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].startTime.toLocaleDateString()).toEqual(dateString);
  });
});

describe("getRequestByRequestId", () => {
  test("should return request detail from selected requestId", async () => {
    const result = await getRequestByRequestId({ requestId: 1 });
    // console.log("getRequestByRequestId", result);
    expect(result.id).toBe(1);
  });
});

describe("getRequestByUUID", () => {
  test("should return request detail from selected uuid", async () => {
    const uuid = "b3a84e07-9be6-4b4b-8abc-c6346d52824d";
    const result = await getRequestsByUUID({ uuid });
    // console.log("getRequestByUUID", result);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          patientUUID: uuid,
        }),
      ])
    );
  });
});

// describe("acceptRequest", () => {
//   test("should create a new time slot and schedule for selected doctorUUID and connect it with requestId", async () => {
//     const data = {
//       requestId: 14,
//       uuid: "19bf00dc-f1dc-41d6-8540-51a264994372",
//       startTime: new Date().toLocaleString(),
//       finishTime: new Date(new Date().getTime() + 3600000).toLocaleString(),
//     };
//     const result = await acceptRequest(data)
//     console.log('result', result)
//     expect(result.requestId).toBe(data.requestId)
//   });
// });

describe("getDoctors", () => {
  test("should return all doctors detail", async () => {
    const result = await getDoctors();
    // console.log('result', result)
  });
});

describe("bookTimeSlot", () => {
  test("should create a request and connect to the selected time slot", async () => {
    const data = {
      price: 1000,
      startTime: new Date().toLocaleString(),
      finishTime: new Date(new Date().getTime() + 3600000).toLocaleString(),
      patientUUID: "3be79210-16ed-4224-b4a9-d351242b4e9b",
      timeslotId: 12,
      location: "ZOOM",
    };
    const result = await bookTimeSlot({ ...data, meetingType: "ONLINE" });
    console.log("result", result);
    expect(result.patientUUID).toBe(data.patientUUID);
    expect(result.doctorTimeslot?.id).toBe(data.timeslotId);
  });
});
