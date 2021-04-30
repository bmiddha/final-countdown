import { AcademicYearResponse, FinalModel, FinalResponse, FinalsResponse } from '../../models';
import { NextApiRequest, NextApiResponse } from 'next';
import { DateTime } from 'luxon';
import axios from 'axios';

const handler = async (_req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    const yearResponse = await axios.get<AcademicYearResponse>(
      'https://apps.registrar.uic.edu/assets/api/current-academic-year.json'
    );
    const now = new Date();
    const term = '220211';
    const { data } = await axios.get<FinalsResponse>(
      `https://apps.registrar.uic.edu/assets/scripts/finals-initial-query.php?term=${term}`
    );
    const parsed = data.output
      .map(
        (e: FinalResponse): FinalModel => {
          const date = `${e.day} ${DateTime.local().year}`;
          let startTimeHour = e.time.split(' ')[0].split(':')[0];
          const startTimeMinute = e.time.split(' ')[0].split(':')[1];
          let endTimeHour = e.time.split(' ')[2].split(':')[0];
          const endTimeMinute = e.time.split(' ')[2].split(':')[1];
          const amPmStr = e.time.split(' ')[3];
          if (amPmStr === 'pm' || amPmStr === 'PM') {
            if (parseInt(startTimeHour) > parseInt(endTimeHour) && parseInt(startTimeHour) !== 12)
              startTimeHour = `${parseInt(startTimeHour) + 12}`;
            else if (parseInt(endTimeHour) !== 12) {
              endTimeHour = `${parseInt(endTimeHour) + 12}`;
              if (parseInt(startTimeHour) !== 12) {
                startTimeHour = `${parseInt(startTimeHour) + 12}`;
              }
            }
          }
          const finalStart = DateTime.fromFormat(`${date} ${startTimeHour}:${startTimeMinute}`, 'ccc LLL d yyyy T', {
            zone: 'America/Chicago',
          }).toMillis();
          const finalEnd = DateTime.fromFormat(`${date} ${endTimeHour}:${endTimeMinute}`, 'ccc LLL d yyyy T', {
            zone: 'America/Chicago',
          }).toMillis();
          const courseCRNMeetingTimeSplit = e.course.split('<br/>');
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
            instructor: '',
          };
        }
      )
      .filter((e: FinalModel) => e.finalEnd > +now)
      .sort((e1: FinalModel, e2: FinalModel) => e1.finalStart - e2.finalStart);
    res.status(200).json({
      allFinals: parsed,
      academicYear: yearResponse.data,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

export default handler;
