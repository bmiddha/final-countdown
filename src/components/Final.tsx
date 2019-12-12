import React, { FC, useState, useEffect } from 'react';
import Countdown from './Countdown';
import { DaysShortNames, MonthShortNames } from '../models/Date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassHalf, faHourglassStart, faHourglassEnd, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { FinalModel } from '../models/Final';
import './Final.css';

const Final: FC<FinalModel> = (props: FinalModel) => {

    const [isOngoing, setIsOngoing] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        setIsOngoing(+props.finalStart < +new Date());
        setIsEnded(+props.finalEnd < +new Date());
    }, [props.finalStart, props.finalEnd]);

    const humanizeDate = (d: Date) => `${DaysShortNames[d.getDay()]}, ${MonthShortNames[d.getMonth()]} ${d.getDate()}`;
    const humanizeTime = (d: Date) => `${(d.getHours() > 12 ? d.getHours() - 12 : d.getHours()).toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours() > 11 ? 'PM' : 'AM'}`;
    const border = isEnded ? 'border-success' : isOngoing ? 'border-warning' : +props.finalStart - +new Date() < 30 * 60 * 1000 ? 'border-primary' : '';
    return (
        <div className='col mb-4'>
            <div className={`card final mx-auto ${border}`}>
                <div className={`card-header ${border}`}>
                    <h4 className='card-title'>{props.department} {props.course} {props.crn}</h4>
                </div>
                <div className={`card-body ${border}`}>
                    <h4 className='card-subtitle mb-4 text-muted'><FontAwesomeIcon icon={isEnded ? faHourglassEnd : isOngoing ? faHourglassHalf : faHourglassStart} /> {
                        isEnded ? 'ended'
                            : <><Countdown timer={isOngoing ? props.finalEnd : props.finalStart} /> {isOngoing ? '(ongoing)' : ''}</>
                    }
                    </h4>
                    <h5><FontAwesomeIcon icon={faMapMarkerAlt} />{props.location}</h5>
                    <p className='card-text'>{props.comments} {props.instructor}</p>
                </div>
                <div className={`card-footer ${border}`}>
                    <FontAwesomeIcon icon={faClock} /> {humanizeDate(props.finalStart)} {humanizeTime(props.finalStart)} - {humanizeTime(props.finalEnd)}
                </div>
            </div>
        </div>
    );
};

export default Final;