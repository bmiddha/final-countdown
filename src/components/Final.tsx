import React, { FC } from 'react';
import Countdown from './Countdown';
import { DaysShortNames, MonthShortNames } from '../models/Date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassHalf, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

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

    const humanizeDate = (d: Date) => `${DaysShortNames[d.getDay()]}, ${MonthShortNames[d.getMonth()]} ${d.getDate()}`;
    const humanizeTime = (d: Date) => `${(d.getHours() > 12 ? d.getHours() - 12 : d.getHours()).toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours() > 11 ? 'PM' : 'AM'}`;
    // change border according to final status
    return (
        <div className='col-sm-3 m-3'>
            <div className='card final'>
                <div className='card-header'>
                    <h4 className='card-title'>{props.department} {props.course} {props.crn}</h4>
                </div>
                <div className='card-body'>
                    <h4 className='card-subtitle mb-4 text-muted'><FontAwesomeIcon icon={faHourglassHalf} /> <Countdown endMessage='ongoing' timer={props.finalStart} /></h4>
                    <h5><FontAwesomeIcon icon={faMapMarkerAlt} />{props.location}</h5>
                    <p className='card-text'>{props.comments}</p>
                </div>
                <div className='card-footer'>
                    <FontAwesomeIcon icon={faClock} /> {humanizeDate(props.finalStart)} {humanizeTime(props.finalStart)}- {humanizeTime(props.finalEnd)}
                </div>
            </div>
        </div>

    )
};

export default Final;