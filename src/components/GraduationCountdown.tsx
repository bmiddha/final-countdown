import React, { FC } from 'react';
import Countdown from './Countdown';

interface GraduationCountdownProps {
    term: string;
    timer: Date;
}

const GraduationCountdown: FC<GraduationCountdownProps> = ({ term, timer }: GraduationCountdownProps) => (
    <div className='container py-4'>
        <div className='col'>
            <h1 className='m-4 text-center'>{term} Graduation <span className='countdown'><Countdown endMessage='🎉' timer={timer} /></span></h1>
        </div>
    </div>
);

export default GraduationCountdown;
