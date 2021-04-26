import { AcademicYearResponse } from "../models/AcademicYearApi";
import Config from "../Config";

let cache: { expiry: Date; data: AcademicYearResponse };

const GetAcademicYear = async (): Promise<AcademicYearResponse> => {
  const now = new Date();
  try {
    const localCache = window.localStorage.getItem("academicYearCache");
    if (localCache) {
      cache = JSON.parse(localCache);
    }
    if (+now > +cache.expiry) {
      cache = {
        data: await (
          await fetch("https://xorigin.azurewebsites.net/uicregistrar/assets/api/current-academic-year.json")
        ).json(),
        expiry: new Date(+now + Config.cacheStaleThreshold),
      };
      window.localStorage.setItem("academicYearCache", JSON.stringify(cache));
    }
  } catch (e) {
    window.localStorage.removeItem("academicYearCache");
    cache = {
      data: await (
        await fetch("https://xorigin.azurewebsites.net/uicregistrar/assets/api/current-academic-year.json")
      ).json(),
      expiry: new Date(+now + Config.cacheStaleThreshold),
    };
    window.localStorage.setItem("academicYearCache", JSON.stringify(cache));
  }
  return cache.data;
};

export default GetAcademicYear;
