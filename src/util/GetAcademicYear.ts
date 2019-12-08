import { Response } from '../models/AcademicYearApi';

let cache: Response;

const GetAcademicYear = async (): Promise<Response> => {
    if (!cache)
        cache = await (await fetch('https://xorigin.azurewebsites.net/uicregistrar/assets/api/current-academic-year.json')).json();
    return cache;
};

export default GetAcademicYear;
