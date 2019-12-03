import React, { FC } from 'react';
import Countdown from './Countdown';
import { DaysShortNames, MonthShortNames } from '../models/Date';
export interface FinalProps {
    type: string;
    department: string;
    course: string;
    crn: string;
    finalStart: Date;
    finalEnd: Date;
    location: string;
    comments: string;
};


const Final: FC<FinalProps> = (props: FinalProps) => {

    const humanizeDate = (d: Date) => `${DaysShortNames[d.getDay()]}, ${MonthShortNames[d.getMonth()]} ${d.getDate()}`;
    const humanizeTime = (d: Date) => `${(d.getHours() > 12 ? d.getHours() - 12 : d.getHours()).toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours() > 11 ? 'PM' : 'AM'}`;
    return (
        <div className='final'>
            <p className='finalNum darkCoolShadow'>{props.department} {props.course} {props.crn}</p>
            <p className='finalCountdown darkCoolShadow'><Countdown endMessage='ongoing' timer={props.finalStart} /></p>
            <p className='finalTime'>{humanizeDate(props.finalStart)}: {humanizeTime(props.finalStart)}- {humanizeTime(props.finalEnd)}</p>
            <p className='finalLocation'><span>{props.location}</span></p>
            {props.comments}
        </div>
    )
};

export default Final;