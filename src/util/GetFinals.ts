import { Response, FinalResponse } from '../models/FinalsApi';
import { FinalModel } from '../models/Final';

const GetFinals = async (term: string): Promise<FinalModel[]> => {
    const res: Response = await (await fetch(`https://xorigin.azurewebsites.net/uicregistrar/assets/scripts/finals-initial-query.php?term=${term}`)).json();
    return res.output.map((e: FinalResponse): FinalModel => {
        const date = `${e.day} 2019`;
        let startTimeHour = e.time.split(' ')[0].split(':')[0];
        const startTimeMinute = e.time.split(' ')[0].split(':')[1];
        let endTimeHour = e.time.split(' ')[2].split(':')[0];
        const endTimeMinute = e.time.split(' ')[2].split(':')[1];
        const amPmStr = e.time.split(' ')[3];
        if (amPmStr === 'pm' || amPmStr === 'PM') {
            if (parseInt(startTimeHour) > parseInt(endTimeHour))
                startTimeHour = `${parseInt(startTimeHour) + 12}`
            else if (parseInt(endTimeHour) !== 12) {
                endTimeHour = `${parseInt(endTimeHour) + 12}`
                startTimeHour = `${parseInt(startTimeHour) + 12}`
            }
        }
        const finalStart = new Date(`${date} ${startTimeHour}:${startTimeMinute}`);
        const finalEnd = new Date(`${date} ${endTimeHour}:${endTimeMinute}`);
        const courseSplit = e.course.split(' ').filter(e => e.length !== 0);
        return {
            finalStart, finalEnd,
            location: `${e.building} ${e.rooms}`,
            department: courseSplit[0],
            crn: courseSplit[3],
            course: courseSplit[1],
            comments: e.comments,
            type: e.type,
            instructor: ''
        };
    }).filter((e: FinalModel) => +e.finalEnd > +new Date())
        .sort((e1: FinalModel, e2: FinalModel) => +e1.finalStart - +e2.finalStart);
};

export default GetFinals;
