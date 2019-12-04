import React, { FC, useState, useEffect } from 'react';
import Countdown from '../components/Countdown';
import Finals from '../components/Finals';
import { FinalProps } from '../components/Final';
import * as AcedemicYearApi from '../models/AcedemicYearApi';

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
    const [term, setTerm] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            // get term and year
            const acedemicYear: AcedemicYearApi.Response = await (await fetch('https://xorigin.azurewebsites.net/uicregistrar/assets/api/current-academic-year.json')).json();
            (window as any).acedemicYear = acedemicYear; // for debugging

            let nearestTerm: AcedemicYearApi.Term = acedemicYear.terms.fall;
            // TODO: Add support for summer semester
            if (new Date().getTime() - (acedemicYear.terms.spring.finals.start.timestamp * 1000) > 0 &&
                new Date().getTime() - (acedemicYear.terms.spring.finals.start.timestamp * 1000) < new Date().getTime() - (nearestTerm.finals.start.timestamp)) {
                nearestTerm = acedemicYear.terms.spring;
            }

            setTerm(nearestTerm.term_data.name);

            const res: FinalsApiResponse = await (await fetch(`https://xorigin.azurewebsites.net/uicregistrar/assets/scripts/finals-initial-query.php?term=${nearestTerm.term_data.term_code}`)).json();
            (window as any).finals = res; // for debugging
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

    return (
        <>

            <div id='topbar' className='lightCoolShadow'>
                <h1>{lastFinal ? <>{term} Graduation <span className='countdown'><Countdown endMessage='Yay' timer={lastFinal.finalEnd} /></span></> : <></>}</h1>
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