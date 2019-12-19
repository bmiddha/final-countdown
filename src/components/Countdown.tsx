import { h, Fragment, FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Config from '../Config';

interface CountdownProps {
    endMessage?: string;
    timer: Date;
};

const Countdown: FunctionalComponent<CountdownProps> = ({ timer, endMessage }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState(+timer - +new Date());

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setTimeLeft(+timer - +new Date());
            if (timeLeft < 0)
                clearInterval(updateInterval);
        }, Config.countdownUpdateInterval);
        return (() => {
            clearInterval(updateInterval);
        });
    });

    return (
        <span className='text-monospace'>
            {timeLeft >= 0 ? <Fragment>
                {Math.floor((timeLeft / (1000 * 60 * 60))).toString().padStart(2, '0')}
                :{Math.floor((timeLeft / (1000 * 60)) % 60).toString().padStart(2, '0')}
                :{Math.floor((timeLeft / 1000) % 60).toString().padStart(2, '0')}
            </Fragment> : <span>{endMessage}</span>}
        </span>
    );
};

export default Countdown;
