import { DateTime } from "luxon";
import React, { FC, useEffect, useState } from "react";
import Config from "../Config";

interface CountdownProps {
  endMessage?: string;
  timer: DateTime;
}

const Countdown: FC<CountdownProps> = ({ timer, endMessage }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(+timer - +new Date());

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setTimeLeft(+timer - +new Date());
      if (timeLeft < 0) clearInterval(updateInterval);
    }, Config.countdownUpdateInterval);
    return () => {
      clearInterval(updateInterval);
    };
  });

  return (
    <span className="text-monospace">
      {timeLeft >= 0 ? (
        <>
          {Math.floor(timeLeft / (1000 * 60 * 60))
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor((timeLeft / (1000 * 60)) % 60)
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor((timeLeft / 1000) % 60)
            .toString()
            .padStart(2, "0")}
        </>
      ) : (
        <span>{endMessage}</span>
      )}
    </span>
  );
};

export default Countdown;
