import React, { FC, useEffect, useState } from 'react';

import { Config } from '../util';

export type CountdownProps = {
  endMessage?: string;
  timer: number;
};

export const Countdown: FC<CountdownProps> = ({ timer, endMessage }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(timer - new Date().getTime());

  useEffect(() => {
    const timerInterval = window.setInterval(() => {
      const _timeLeft = timer - new Date().getTime();
      setTimeLeft(_timeLeft);
      if (_timeLeft < 0) {
        clearInterval(timerInterval);
      }
    }, Config.countdownUpdateInterval);
    return () => clearInterval(timerInterval);
  }, [timer]);

  return (
    <span className="text-monospace">
      {timeLeft >= 0 ? (
        <>
          {Math.floor(timeLeft / (1000 * 60 * 60))
            .toString()
            .padStart(2, '0')}
          :
          {Math.floor((timeLeft / (1000 * 60)) % 60)
            .toString()
            .padStart(2, '0')}
          :
          {Math.floor((timeLeft / 1000) % 60)
            .toString()
            .padStart(2, '0')}
        </>
      ) : (
        <span>{endMessage}</span>
      )}
    </span>
  );
};

export default Countdown;
