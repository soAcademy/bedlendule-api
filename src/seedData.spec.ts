import { MeetingTypeEnum, ProblemTypeEnum, UserTypeEnum } from "@prisma/client";
import { createRequest, createSchedule, createUser } from "./resolver";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { createRequestCodec } from "./interface";
import * as t from "io-ts";
import { hash } from "./auth";

[...Array(10).keys()].map(() => {
  describe("BEDLENDULE", () => {
    let patientUUID: string;
    let doctorUUID: string;
    test("createPatient", async () => {
      patientUUID = uuidv4();
      const data = {
        type: UserTypeEnum.PATIENT,

        uuid: patientUUID,
        username: "testuser1" + new Date().getTime(),
        password: await hash("testpassword"),
        email: "testemail" + new Date().getTime() + "@gmail.com",
        phoneNumber: "012" + new Date().getTime(),
        firstName: "Test" + new Date().getTime(),
        lastName: "User" + new Date().getTime(),
      };
      const result = await createUser(data);
      expect(result.uuid).toBe(patientUUID);
    });

    test("createDoctor", async () => {
      doctorUUID = uuidv4();
      const data = {
        type: UserTypeEnum.DOCTOR,
        uuid: doctorUUID,
        username: "testuser1" + new Date().getTime(),
        password: await hash("testpassword"),
        email: "testemail" + new Date().getTime() + "@gmail.com",
        phoneNumber: "012" + new Date().getTime(),
        firstName: "Test" + new Date().getTime(),
        lastName: "User" + new Date().getTime(),
      };
      const result = await createUser(data);
      // console.log("createUser", result);
      expect(result.uuid).toBe(doctorUUID);
    });

    // test("createSchedule", async () => {
    //   const nSchedule = [...Array(Math.ceil(Math.random() * 4)).keys()];
    //   const result = await Promise.all(
    //     nSchedule.map(async () => {
    //       const meetingType = [MeetingTypeEnum.ONLINE, MeetingTypeEnum.OFFLINE][
    //         Math.floor(Math.random() * 2)
    //       ];
    //       const startTime =
    //         new Date(new Date().toLocaleDateString()).getTime() +
    //         86400000 * Math.ceil(Math.random() * 30) +
    //         3600000 * Math.ceil(Math.random() * 24);
    //       const finishTime = startTime + 1800000 * Math.ceil(Math.random() * 2);
    //       const data = {
    //         uuid: doctorUUID,
    //         title: "Depression Therapist",
    //         description:
    //           "You may not feel like it right now but thats my job. I want to hear every bit of what's going wrong and how it's impacting you now. At the same time we'll work on developing your belief in yourself in order to actually use the coping skills you probably already have.",
    //         meetingType,
    //         location:
    //           meetingType === MeetingTypeEnum.ONLINE
    //             ? "ZOOM"
    //             : ["JOJO CLINIC", "JOJI CLINIC", "BOBO CLINIC", "BUBU CLINIC"][
    //                 Math.floor(Math.random() * 4)
    //               ],
    //         timeslots: [
    //           {
    //             startTime: new Date(startTime).toLocaleString(),
    //             finishTime: new Date(finishTime).toLocaleString(),
    //             price: 600,
    //           },
    //           {
    //             startTime: new Date(finishTime + 3600000).toLocaleString(),
    //             finishTime: new Date(finishTime + 7200000).toLocaleString(),
    //             price: 700,
    //           },
    //         ],
    //       };
    //       const result = await createSchedule(data);
    //       return result;
    //     })
    //   );
    //   console.log("result", result);
    // });

    // test("should create a request with the given arguments", async () => {
    //   const startTime =
    //     new Date(new Date().toLocaleDateString()).getTime() +
    //     86400000 * Math.ceil(Math.random() * 30) +
    //     3600000 * Math.ceil(Math.random() * 24);
    //   const finishTime = startTime + 1800000 * Math.ceil(Math.random() * 2);
    //   const requestArgs = {
    //     title: "Example Request",
    //     description: "This is an example request",
    //     problemType: [
    //       ProblemTypeEnum.DEPRESSION,
    //       ProblemTypeEnum.MENTAL_HEALTH,
    //       ProblemTypeEnum.BIPOLAR,
    //       ProblemTypeEnum.DEMENTIA,
    //       ProblemTypeEnum.PANIC_DISORDER,
    //       ProblemTypeEnum.PHOBIAS,
    //       ProblemTypeEnum.POST_TRAUMATIC_STRESS_DISORDER,
    //       ProblemTypeEnum.SCHIZOPHRENIA,
    //     ][Math.floor(Math.random() * 2)],
    //     price: 500,
    //     meetingType: [MeetingTypeEnum.ONLINE, MeetingTypeEnum.OFFLINE][
    //       Math.floor(Math.random() * 2)
    //     ],
    //     startTime: new Date(startTime).toLocaleString(),
    //     finishTime: new Date(finishTime).toLocaleString(),
    //     patientUUID: patientUUID,
    //   };

    //   const createdRequest = await createRequest(requestArgs);

    //   expect(createdRequest.title).toBe(requestArgs.title);
    //   expect(createdRequest.description).toBe(requestArgs.description);
    //   expect(createdRequest.price).toBe(requestArgs.price);
    //   expect(createdRequest.patientUUID).toBe(requestArgs.patientUUID);
    // });

    // test("should throw an error if the given arguments are invalid", async () => {
    //   const invalidRequestArgs: t.TypeOf<typeof createRequestCodec> = {
    //     title: "Example Request",
    //     description: "This is an example request",
    //     problemType: ProblemTypeEnum.DEPRESSION,
    //     price: 50,
    //     meetingType: MeetingTypeEnum.OFFLINE,
    //     startTime: "invalid-date-time",
    //     finishTime: "invalid-date-time",
    //     patientUUID: "ba797dc5-75d1-4a48-bc54-f5e45d53c02b",
    //   };

    //   await expect(createRequest(invalidRequestArgs)).rejects.toThrow();
    // });
  });
});
