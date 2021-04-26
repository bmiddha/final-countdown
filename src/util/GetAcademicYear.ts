import { AcademicYearResponse } from "../models/AcademicYearApi";
import Config from "../Config";

type LocalCache = { expiry: Date; data: AcademicYearResponse };

const getAndRepopulateCache = async () => {
  const now = new Date();
  window.localStorage.removeItem("academicYearCache");
  const newCache = {
    data: await (
      await fetch("https://xorigin.azurewebsites.net/uicregistrar/assets/api/current-academic-year.json")
    ).json(),
    expiry: new Date(+now + Config.cacheStaleThreshold),
  };
  window.localStorage.setItem("academicYearCache", JSON.stringify(newCache));
  return newCache.data;
};

const GetAcademicYear = async (): Promise<AcademicYearResponse> => {
  const now = new Date();
  const localCache = window.localStorage.getItem("academicYearCache");
  if (localCache) {
    let parsed: LocalCache | undefined;
    try {
      parsed = JSON.parse(localCache);
    } catch (e) {
      window.localStorage.removeItem("academicYearCache");
    }
    if (parsed && parsed.data && parsed.expiry && +now < +parsed.expiry) {
      return parsed.data;
    } else {
      return await getAndRepopulateCache();
    }
  } else {
    return await getAndRepopulateCache();
  }
};

export default GetAcademicYear;
