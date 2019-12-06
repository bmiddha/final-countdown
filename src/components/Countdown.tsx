import React, { FC, useEffect, useState } from 'react';

interface CountdownProps {
    endMessage?: string;
    timer: Date;
};

interface TimerComponents {
    difference: number;
    hours: string;
    minutes: string;
    seconds: string;
}

const Countdown: FC<CountdownProps> = ({ timer, endMessage }: CountdownProps) => {
    const calculateTimeLeft = (): TimerComponents => {
        const difference = timer.getTime() - new Date().getTime();
        return {
            difference,
            hours: Math.floor((difference / (1000 * 60 * 60))).toString().padStart(2, '0'),
            minutes: Math.floor((difference / (1000 * 60)) % 60).toString().padStart(2, '0'),
            seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return (() => {
            clearInterval(updateInterval);
        });
    });

    return (
        <span>
            {timeLeft.difference > 0 ? <>{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</> : <span>{endMessage}</span>}
        </span>
    );
};

export default Countdown;