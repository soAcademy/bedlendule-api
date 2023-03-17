import { MeetingTypeEnum, UserTypeEnum } from "@prisma/client";
import {
  createSchedule,
  createUser,
  deleteSchedule,
  getSchedule,
  getScheduleByDate,
  getUserDetailByUUID,
  updateSchedule,
  updateUser,
} from "./resolver";
import { v4 as uuidv4 } from "uuid";

describe("BEDLENDULE", () => {
  let uuid: string;
  test("createUser", async () => {
    uuid = uuidv4();
    const data = {
      type: UserTypeEnum.DOCTOR,
      uuid: uuid,
      username: "testuser1" + new Date().getTime(),
      password: "testpassword",
      email: "testemail" + new Date().getTime() + "@gmail.com",
      phoneNumber: "012" + new Date().getTime(),
      firstName: "Test",
      lastName: "User",
    };
    const result = await createUser(data);
    console.log("createUser", result);
  });
  test("getUserDetailByUUID", async () => {
    const result = await getUserDetailByUUID({ uuid });
    console.log("result", result);
  });

  test("updateUser", async () => {
    const data = {
      uuid,
      email: "UpdatedEmail" + new Date().getTime(),
      licenseId: "TEST-LIC-01" + new Date().getTime(),
    };
    const result = await updateUser(data);
    console.log("updateUser", result);
  });

  test("createSchedule", async () => {
    const startTime = new Date().getTime() + 86400000;
    const finishTime = startTime + 3600000;
    const data = {
      uuid: "6f2ef610-38cb-4694-9460-6bf4020a9fa7",
      specialistInfo: "Psychologist",
      meetingType: MeetingTypeEnum.ONLINE,
      timeslots: [
        {
          startTime: new Date(startTime).toLocaleString(),
          finishTime: new Date(finishTime).toLocaleString(),
        },
        {
          startTime: new Date(startTime + 7200000).toLocaleString(),
          finishTime: new Date(finishTime + 10800000).toLocaleString(),
        },
      ],
    };
    const result = await createSchedule(data);
    console.log("createSchedule", result);
  });

  test("getSchedule", async () => {
    const result = await getSchedule({
      uuid: "6f2ef610-38cb-4694-9460-6bf4020a9fa7",
    });
    console.log("getSchedule", result);
  });

  test("getScheduleByDate", async () => {
    const data = {
      uuid: "6f2ef610-38cb-4694-9460-6bf4020a9fa7",
      date: new Date(new Date().getTime() + 86400000).toLocaleDateString(),
    };
    const result = await getScheduleByDate(data);
    console.log("getScheduleByDate", result);
  });

  test("updateSchedule", async () => {
    const data = {
      scheduleId: 1,
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
    console.log("updateSchedule", result);
  });
  test("deleteSchedule", async () => {
    const result = await deleteSchedule({ scheduleId: 15 });
    console.log("deleteSchedule", result);
  });
});
