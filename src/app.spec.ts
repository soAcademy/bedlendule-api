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
  reviewDoctor,
} from "./resolver";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { createRequestCodec } from "./interface";
import * as t from "io-ts";

let patientUUID: string;
let doctorUUID: string;
let timeslotIdToBeBooked: number;

// describe("BEDLENDULE", () => {
//   test("createUser(Patient)", async () => {
//     patientUUID = uuidv4();
//     const data = {
//       type: UserTypeEnum.PATIENT,
//       uuid: patientUUID,
//       username: "testuser1" + new Date().getTime(),
//       password: "testpassword",
//       email: "testemail" + new Date().getTime() + "@gmail.com",
//       phoneNumber: "012" + new Date().getTime(),
//       firstName: "Test",
//       lastName: "User",
//     };
//     const result = await createUser(data);
//     // console.log("createUser", result);
//     expect(result.uuid).toBe(patientUUID);
//     expect(result.type).toBe(UserTypeEnum.PATIENT);
//   });
//   test("createUser(Doctor)", async () => {
//     doctorUUID = uuidv4();
//     const data = {
//       type: UserTypeEnum.DOCTOR,
//       uuid: doctorUUID,
//       username: "testuser1" + new Date().getTime(),
//       password: "testpassword",
//       email: "testemail" + new Date().getTime() + "@gmail.com",
//       phoneNumber: "012" + new Date().getTime(),
//       firstName: "Test",
//       lastName: "User",
//     };
//     const result = await createUser(data);
//     // console.log("createUser", result);
//     expect(result.uuid).toBe(doctorUUID);
//     expect(result.type).toBe(UserTypeEnum.DOCTOR);
//   });
//   test("getUserDetailByUUID", async () => {
//     const result = await getUserDetailByUUID({ uuid: doctorUUID });
//     // console.log("result", result);
//     expect(result.uuid).toBe(doctorUUID);
//   });

  test("updateUser", async () => {
    const data = {
      uuid: doctorUUID,
      email: "UpdatedEmail" + new Date().getTime(),
      licenseId: "TEST-LIC-01" + new Date().getTime(),
    };
    const result = await updateUser(data);
    // console.log("updateUser", result);
    expect(result.uuid).toBe(data.uuid);
    expect(result.email).toBe(data.email);
    expect(result.licenseId).toBe(data.licenseId);
  });
  let scheduleId: number;
  let timeslotId: number[];
  test("createSchedule", async () => {
    const startTime = new Date().getTime() + 86400000;
    const finishTime = startTime + 3600000;
    const data = {
      uuid: doctorUUID,
      title: "Depression Therapist",
      description: "I want to hear every bit of what's going wrong and how it's impacting you now. ",
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
    scheduleId = result.id;
    timeslotId = result.timeslots.map((timeslot) => timeslot.id);
    // console.log("createSchedule", result);
    expect(result.uuid).toBe(data.uuid);
    expect(result.title).toBe(data.title);
    expect(result.description).toBe(data.description);
    expect(result.meetingType).toBe(data.meetingType);
  });

//   test("getAllTimeSlots", async () => {
//     const result = await getAllTimeSlots();
//     // console.log("getSchedule", result);
//     expect(result.length > 0).toBe(true);
//   });

//   test("getScheduleByDate", async () => {
//     const data = {
//       uuid: doctorUUID,
//       date: new Date(new Date().getTime() + 86400000).toLocaleDateString(),
//     };
//     const result = await getScheduleByDate(data);
//     // console.log("getScheduleByDate", result);
//     expect(result.length > 0).toBe(true);
//   });

  test("getScheduleByUUID", async () => {
    const uuid = doctorUUID;
    const result = await getScheduleByUUID({ uuid });
    console.log("getScheduleByUUID", result);
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ uuid: uuid })])
    );
  });
  test("updateSchedule", async () => {
    const data = {
      scheduleId,
      title: "Mental Health Therapist",
      meetingType: MeetingTypeEnum.OFFLINE,
      location: ["JOJO CLINIC", "JOJI CLINIC", "BOBO CLINIC", "BUBU CLINIC"][
        Math.floor(Math.random() * 4)
      ],
      removingTimeSlots: timeslotId,
      addingTimeSlots: [
        {
          startTime: new Date(new Date().getTime() + 86400000).toLocaleString(),
          finishTime: new Date(
            new Date().getTime() + 90000000
          ).toLocaleString(),
          price: 600
        },
        {
          startTime: new Date(new Date().getTime() + 90000000).toLocaleString(),
          finishTime: new Date(
            new Date().getTime() + 93600000
          ).toLocaleString(),
          price: 500
        },
      ],
    };
    const result = await updateSchedule(data);
    timeslotIdToBeBooked = result.timeslots[0].id;
    expect(result.title).toBe(data.title);
    expect(result.meetingType).toBe(data.meetingType);
    expect(result.id).toBe(scheduleId);
    expect(result.timeslots).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: timeslotId[0],
        }),
      ])
    );
    // console.log("updateSchedule", result);
  });
  test("deleteSchedule", async () => {
    const startTime = new Date().getTime() + 86400000;
    const finishTime = startTime + 3600000;
    const data = {
      uuid: doctorUUID,
      title: "Depression Therapist",
      description: "Psychologist",
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
    const schedule = await createSchedule(data);
    const result = await deleteSchedule({ scheduleId: schedule.id });
    // console.log("deleteSchedule", result);
    expect(result.id).toBe(schedule.id);
  });

let createdRequest: any;
describe("createRequest", () => {
  it("should create a request with the given arguments", async () => {
    const requestArgs = {
      title: "Example Request",
      description: "This is an example request",
      problemType: ProblemTypeEnum.DEPRESSION,
      price: 500,
      meetingType: MeetingTypeEnum.ONLINE,
      location: "ZOOM",
      startTime: new Date(new Date().getTime() + 3600000).toLocaleString(),
      finishTime: new Date(new Date().getTime() + 7200000).toLocaleString(),
      patientUUID: patientUUID,
    };
  )
//     createdRequest = await createRequest(requestArgs);
//     expect(createdRequest.title).toBe(requestArgs.title);
//     expect(createdRequest.description).toBe(requestArgs.description);
//     expect(createdRequest.price).toBe(requestArgs.price);
//     expect(createdRequest.patientUUID).toBe(requestArgs.patientUUID);
//   });

//   it("should throw an error if the given arguments are invalid", async () => {
//     const invalidRequestArgs: t.TypeOf<typeof createRequestCodec> = {
//       title: "Example Request",
//       description: "This is an example request",
//       problemType: ProblemTypeEnum.DEPRESSION,
//       price: 50,
//       meetingType: MeetingTypeEnum.OFFLINE,
//       startTime: "invalid-date-time",
//       finishTime: "invalid-date-time",
//       patientUUID: patientUUID,
//     };

//     await expect(createRequest(invalidRequestArgs)).rejects.toThrow();
//   });
// });

// describe("getOpeningRequests", () => {
//   test("should return all requests with doctorTimeslot = null", async () => {
//     const result = await getOpeningRequests();
//     // console.log("getOpeningRequests", result);
//     expect(result).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({ doctorTimeslot: null }),
//       ])
//     );
//   });
// });

// describe("getOpeningRequestsByDate", () => {
//   test("should return all requests with doctorTimeslot:null, startTime and finishTime are in the selected date", async () => {
//     const result = await getOpeningRequestsByDate({
//       date: createdRequest.startTime.toLocaleDateString(),
//     });
//     // console.log("getOpeningRequestsByDate", result);
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0].startTime.toLocaleDateString()).toEqual(
//       createdRequest.startTime.toLocaleDateString()
//     );
//   });
// });

// describe("getRequestByRequestId", () => {
//   test("should return request detail from selected requestId", async () => {
//     const result = await getRequestByRequestId({
//       requestId: createdRequest.id,
//     });
//     // console.log("getRequestByRequestId", result);
//     expect(result.id).toBe(createdRequest.id);
//   });
// });

// describe("getRequestByUUID", () => {
//   test("should return request detail from selected uuid", async () => {
//     const uuid = patientUUID;
//     const result = await getRequestsByUUID({ uuid });
//     // console.log("getRequestByUUID", result);
//     expect(result).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           patientUUID: uuid,
//         }),
//       ])
//     );
//   });
// });

// describe("acceptRequest", () => {
//   test("should create a new time slot and schedule for selected doctorUUID and connect it with requestId", async () => {
//     const data = {
//       requestId: createdRequest.id,
//       uuid: doctorUUID,
//       startTime: createdRequest.startTime.toLocaleString(),
//       finishTime: createdRequest.finishTime.toLocaleString(),
//     };
//     const result = await acceptRequest(data);
//     console.log("result", result);
//     expect(result.requestId).toBe(data.requestId);
//   });
// });

// describe("getDoctors", () => {
//   test("should return all doctors detail", async () => {
//     const result = await getDoctors();
//     // console.log('result', result)
//     expect(result.length > 0).toBe(true);
//   });
// });

// describe("bookTimeSlot", () => {
//   test("should create a request and connect to the selected time slot", async () => {
//     const data = {
//       price: 1000,
//       startTime: new Date().toLocaleString(),
//       finishTime: new Date(new Date().getTime() + 3600000).toLocaleString(),
//       patientUUID: patientUUID,
//       timeslotId: timeslotIdToBeBooked,
//       location: "ZOOM",
//     };
//     const result = await bookTimeSlot({ ...data, meetingType: "ONLINE" });
//     console.log("result", result);
//     expect(result.patientUUID).toBe(data.patientUUID);
//     expect(result.doctorTimeslot?.id).toBe(data.timeslotId);
//   });
// });

describe("reviewDoctor",()=>{
  test("reviewDoctor",async()=>{
    const review = "She cares so much of my boring story. Her aptitude in the symtoms really makes me confident that she could help me"
    const score = 4;
    const doctorId = 36;
    const result = await reviewDoctor({
      review:review,
      score:score,
      doctorId:doctorId
    })
    console.log("review doctor",result)
   
  })
});