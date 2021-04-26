import { FinalsResponse, FinalResponse } from "../models/FinalsApi";
import { FinalModel } from "../models/Final";
import Config from "../Config";
import { DateTime } from "luxon";

let cache: { expiry: Date; data: FinalsResponse };

const GetFinals = async (term: string): Promise<FinalModel[]> => {
  const now = new Date();
  try {
    const localCache = window.localStorage.getItem("finalsResponseCache");
    if (localCache) {
      cache = JSON.parse(localCache);
    }
    if (+now > +cache.expiry) {
      cache = {
        data: await (
          await fetch(
            `https://xorigin.azurewebsites.net/uicregistrar/assets/scripts/finals-initial-query.php?term=${term}`
          )
        ).json(),
        expiry: new Date(+now + Config.cacheStaleThreshold),
      };
      window.localStorage.setItem("finalsResponseCache", JSON.stringify(cache));
    }
  } catch (e) {
    window.localStorage.removeItem("finalsResponseCache");
    cache = {
      data: await (
        await fetch(
          `https://xorigin.azurewebsites.net/uicregistrar/assets/scripts/finals-initial-query.php?term=${term}`
        )
      ).json(),
      expiry: new Date(+now + Config.cacheStaleThreshold),
    };
    window.localStorage.setItem("finalsResponseCache", JSON.stringify(cache));
  }
  return cache.data.output
    .map(
      (e: FinalResponse): FinalModel => {
        const date = `${e.day} ${DateTime.local().year}`;
        let startTimeHour = e.time.split(" ")[0].split(":")[0];
        const startTimeMinute = e.time.split(" ")[0].split(":")[1];
        let endTimeHour = e.time.split(" ")[2].split(":")[0];
        const endTimeMinute = e.time.split(" ")[2].split(":")[1];
        const amPmStr = e.time.split(" ")[3];
        if (amPmStr === "pm" || amPmStr === "PM") {
          if (parseInt(startTimeHour) > parseInt(endTimeHour)) startTimeHour = `${parseInt(startTimeHour) + 12}`;
          else if (parseInt(endTimeHour) !== 12) {
            endTimeHour = `${parseInt(endTimeHour) + 12}`;
            startTimeHour = `${parseInt(startTimeHour) + 12}`;
          }
        }
        const finalStart = DateTime.fromFormat(
          `${date} ${startTimeHour}:${startTimeMinute} America/Chicago`,
          "ccc LLL d yyyy T z"
        );
        const finalEnd = DateTime.fromFormat(
          `${date} ${endTimeHour}:${endTimeMinute} America/Chicago`,
          "ccc LLL d yyyy T z"
        );
        const courseCRNMeetingTimeSplit = e.course.split("<br/>");
        const sectionInfo = courseCRNMeetingTimeSplit[1];
        const courseSplit = courseCRNMeetingTimeSplit[0].split(/[ ]+/);
        return {
          finalStart,
          finalEnd,
          location: `${e.building} ${e.rooms}`,
          department: courseSplit[0],
          crn: courseSplit[3],
          course: courseSplit[1],
          comments: e.comments,
          type: e.type,
          sectionInfo,
          instructor: "",
        };
      }
    )
    .filter((e: FinalModel) => +e.finalEnd > +now)
    .sort((e1: FinalModel, e2: FinalModel) => +e1.finalStart - +e2.finalStart);
};

export default GetFinals;
