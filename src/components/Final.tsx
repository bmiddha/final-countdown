import React, { FC } from 'react';
import Countdown from './Countdown';

export interface FinalProps {
    type: string;
    course: string;
    day: string;
    time: string;
    building: string;
    rooms: string;
    comments: string;
};


const Final: FC<FinalProps> = (props: FinalProps) => {
    const getFinalTime = () => {
        const date = `${props.day} 2019`;
        let startTimeHour = props.time.split(' ')[0].split(':')[0];
        const startTimeMinute = props.time.split(' ')[0].split(':')[1];
        let endTimeHour = props.time.split(' ')[2].split(':')[0];
        const endTimeMinute = props.time.split(' ')[2].split(':')[1];
        const amPmStr = props.time.split(' ')[3];
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
        return { finalStart, finalEnd };
    }
    const { finalStart, finalEnd } = getFinalTime();

    return (
        <div className="final" data-final-start="{finalStart}" data-final-end="{finalEnd}">
            <p className="finalNum darkCoolShadow">{props.course}</p>
            <p className="finalCountdown darkCoolShadow"><Countdown endMessage="ongoing" timer={finalStart} /></p>
            <p className="finalTime">{props.day} | {props.time}</p>
            <p className="finalTime">{finalStart.toString()} | {finalEnd.toString()}</p>
            <p className="finalLocation"><span>{props.building} | {props.rooms}</span></p>
            {props.type} | {props.comments}
        </div>
    )
};

export default Final;