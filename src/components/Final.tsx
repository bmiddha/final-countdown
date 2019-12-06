import React, { FC, useState, useEffect } from 'react';
import Countdown from './Countdown';
import { DaysShortNames, MonthShortNames } from '../models/Date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassHalf, faHourglassStart, faHourglassEnd, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import './Final.css';

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

    const [isOngoing, setIsOngoing] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        if (+props.finalStart < +new Date())
            setIsOngoing(true);
        if (+props.finalEnd < +new Date())
            setIsEnded(true);
    }, [props.finalStart, props.finalEnd]);

    const humanizeDate = (d: Date) => `${DaysShortNames[d.getDay()]}, ${MonthShortNames[d.getMonth()]} ${d.getDate()}`;
    const humanizeTime = (d: Date) => `${(d.getHours() > 12 ? d.getHours() - 12 : d.getHours()).toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours() > 11 ? 'PM' : 'AM'}`;
    const border = isEnded ? 'border-success' : isOngoing ? 'border-warning' : +props.finalStart - +new Date() < 30 * 60 * 1000 ? 'border-primary' : '';
    return (
        <div className='col-sm-3 m-3'>
            <div className={`card final ${border}`}>
                <div className={`card-header ${border}`}>
                    <h4 className='card-title'>{props.department} {props.course} {props.crn}</h4>
                </div>
                <div className={`card-body ${border}`}>
                    <h4 className='card-subtitle mb-4 text-muted'><FontAwesomeIcon icon={isEnded ? faHourglassEnd : isOngoing ? faHourglassHalf : faHourglassStart} /> {
                        isEnded ? 'ended'
                            : <><Countdown timer={isOngoing ? props.finalEnd : props.finalEnd} /> {isOngoing ? '(ongoing)' : ''}</>
                    }
                    </h4>
                    <h5><FontAwesomeIcon icon={faMapMarkerAlt} />{props.location}</h5>
                    <p className='card-text'>{props.comments}</p>
                </div>
                <div className={`card-footer ${border}`}>
                    <FontAwesomeIcon icon={faClock} /> {humanizeDate(props.finalStart)} {humanizeTime(props.finalStart)}- {humanizeTime(props.finalEnd)}
                </div>
            </div>
        </div>
    );
};

export default Final;