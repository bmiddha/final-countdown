import React, { FC, useState, useEffect } from 'react';
import Countdown from '../components/Countdown';
import Finals from '../components/Finals';
import { FinalProps } from '../components/Final';

interface FinalsApiResponseArray {
    type: string;
    course: string;
    day: string;
    time: string;
    building: string;
    rooms: string;
    comments: string;
}

interface FinalsApiResponse {
    rows: number;
    output: FinalsApiResponseArray[];
}

const Home: FC = () => {

    const [finals, setFinals] = useState<FinalProps[]>([]);
    const [lastFinal, setLastFinal] = useState<FinalProps>();
    useEffect(() => {
        const fetchData = async () => {
            // get term and year
            // const year = await (await fetch('https://xorigin.azurewebsites.net/uicregistrar/assets/api/current-academic-year.json')).json();
            // acedemicYear.terms.fall.finals.start.timestamp * 1000
            // acedemicYear.terms.fall.finals.stop.timestamp_eod * 1000
            // acedemicYear.terms.spring.finals.start.timestamp * 1000
            // acedemicYear.terms.spring.finals.stop.timestamp_eod * 1000
            // acedemicYear.terms.summer.finals.session_1.start.timestamp * 1000
            // acedemicYear.terms.summer.finals.session_1.stop.timestamp_eod * 1000
            // acedemicYear.terms.summer.finals.session_2.start.timestamp * 1000
            // acedemicYear.terms.summer.finals.session_2.stop.timestamp_eod * 1000
            // if (acedemicYear.terms.fall.finals.start.timestamp * 1000 - new Date().getTime() > 0) {}
            // else if (acedemicYear.terms.fall.finals.stop.timestamp_eod * 1000 - new Date().getTime() > 0) {}
            // else if (acedemicYear.terms.spring.finals.start.timestamp * 1000 - new Date().getTime() > 0) {}
            // else if (acedemicYear.terms.spring.finals.stop.timestamp_eod * 1000 - new Date().getTime() > 0) {}
            // else if (acedemicYear.terms.summer.finals.session_1.start.timestamp * 1000 - new Date().getTime() > 0) {}
            // else if (acedemicYear.terms.summer.finals.session_1.stop.timestamp_eod * 1000 - new Date().getTime() > 0) {}
            // else if (acedemicYear.terms.summer.finals.session_2.start.timestamp * 1000 - new Date().getTime() > 0) {}
            // else if (acedemicYear.terms.summer.finals.session_2.stop.timestamp_eod * 1000 - new Date().getTime() > 0) {}


            const res: FinalsApiResponse = await (await fetch('https://xorigin.azurewebsites.net/uicregistrar/assets/scripts/finals-initial-query.php?term=220198')).json();
            // const res: FinalsApiResponse = finalsApi;
            (window as any).res = res; // for debugging
            res.output = res.output.filter(e => e.course.startsWith('CS '));
            const finals = res.output.map((e): FinalProps => {
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
                    type: e.type
                };
            });
            (window as any).finals = finals; // for more debugging
            setLastFinal(finals.reduce((acc, f) => {
                if (!acc) {
                    return f;
                } else if (f.finalEnd.getTime() > acc.finalEnd.getTime()) {
                    return f;
                } else {
                    return acc;
                }
            }));
            setFinals(finals);
        }
        fetchData();



    }, []);

    const semester = '';
    const year = '';

    return (
        <>

            <div id='topbar' className='lightCoolShadow'>
                <h1>{lastFinal ? <>{semester} {year} Graduation <span className='countdown'><Countdown endMessage='Yay' timer={lastFinal.finalEnd} /></span></> : <></>}</h1>
            </div>
            <div id='finalsContainer'>
                <Finals finals={finals} />
            </div>
            <footer className='lightCoolShadow'>
                <a href='https://github.com/bmiddha/final-countdown'>github.com/bmiddha/final-countdown</a>
            </footer>
        </>
    );
};

export default Home;