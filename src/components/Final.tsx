import { h, Fragment, FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Countdown from './Countdown';
import { DaysShortNames, MonthShortNames } from '../models/Date';
import { FinalModel } from '../models/Final';
import  * as style from './Final.css';
import Config from '../Config';

const Final: FunctionalComponent<FinalModel> = (props: FinalModel) => {

    const [isOngoing, setIsOngoing] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setIsOngoing(+props.finalStart < +new Date());
            setIsEnded(+props.finalEnd < +new Date());
        }, Config.countdownUpdateInterval);
        return (() => {
            clearInterval(updateInterval);
        });
    });

    const humanizeDate = (d: Date) =>
        `${DaysShortNames[d.getDay()]}, ${MonthShortNames[d.getMonth()]} ${d.getDate()}`;
    const humanizeTime = (d: Date) =>
        `${(d.getHours() > 12 ? d.getHours() - 12 : d.getHours()).toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getHours() > 11 ? 'PM' : 'AM'}`;
    const statusClass = isEnded
        ? 'success'
        : isOngoing
            ? 'info'
            : +props.finalStart - +new Date() < Config.finalWarningBorderTime
                ? 'primary'
                : '';

    return (
        <div className='col mb-4'>
            <div className={`card mx-auto border-${statusClass}`} style='width: 18rem;height: 15rem;'>
                <div className={`card-header border-${statusClass}`}>
                    <h4 className='card-title'>{props.department} {props.course} {props.crn}</h4>
                </div>
                <div className={`card-body border-${statusClass}`}>
                    <h4 className={`card-subtitle mb-4 text-${statusClass}`}><i className={`fas fa-hourglass-${isEnded ? 'end' : isOngoing ? 'half' : 'start'}`} /> {
                        isEnded ? 'ended'
                            : <Fragment><Countdown timer={isOngoing ? props.finalEnd : props.finalStart} /> {isOngoing ? '(ongoing)' : ''}</Fragment>
                    }
                    </h4>
                    <h5><i className='fas fa-map-marker-alt' />{props.location}</h5>
                    <p className='card-text'>{props.comments} {props.instructor}</p>
                </div>
                <div className={`card-footer border-${statusClass}`}>
                    <i className='fas fa-clock' /> {humanizeDate(props.finalStart)} {humanizeTime(props.finalStart)} - {humanizeTime(props.finalEnd)}
                </div>
            </div>
        </div>
    );
};

export default Final;
