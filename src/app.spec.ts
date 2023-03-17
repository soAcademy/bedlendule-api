import { UserTypeEnum } from "@prisma/client";
import {
  createSchedule,
  createUser,
  getSchedule,
  getScheduleByDate,
  getUserDetailByUUID,
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
    console.log("createUser", data);
  });
  test("getUserDetailByUUID", async () => {
    const result = await getUserDetailByUUID({ uuid });
    console.log("result", result);
  });

  test("createSchedule", async () => {
    const startTime = new Date().getTime() + 86400000;
    const finishTime = startTime + 3600000;
    const data = {
      uuid: "6f2ef610-38cb-4694-9460-6bf4020a9fa7",
      specialistInfo: "Psychologist",
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
    console.log("getSchedule", JSON.stringify(result));
  });

  test("getScheduleByDate", async () => {
    const data = {
      uuid: "6f2ef610-38cb-4694-9460-6bf4020a9fa7",
      date: new Date(new Date().getTime() + 86400000).toLocaleDateString(),
    };
    const result = await getScheduleByDate(data);
    console.log(
      "getScheduleByDate",
      result.map((e) => console.log(JSON.stringify(e.timeslots)))
    );
  });
});
