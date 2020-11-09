import React, { FC, useState, useEffect } from "react";
import Countdown from "./Countdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassHalf,
  faHourglassStart,
  faHourglassEnd,
  faMapMarkerAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FinalModel } from "../models/Final";
import "./Final.css";
import Config from "../Config";

const Final: FC<FinalModel> = (props: FinalModel) => {
  const [isOngoing, setIsOngoing] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setIsOngoing(+props.finalStart < +new Date());
      setIsEnded(+props.finalEnd < +new Date());
    }, Config.countdownUpdateInterval);
    return () => {
      clearInterval(updateInterval);
    };
  });

  const statusClass = isEnded
    ? "success"
    : isOngoing
    ? "info"
    : +props.finalStart - +new Date() < Config.finalWarningBorderTime
    ? "primary"
    : "";

  return (
    <div className="col mb-4">
      <div className={`card final mx-auto border-${statusClass}`}>
        <div className={`card-header border-${statusClass}`}>
          <h4 className="card-title">
            {props.department} {props.course} {props.crn}
          </h4>
        </div>
        <div className={`card-body border-${statusClass}`}>
          <h4 className={`card-subtitle mb-4 text-${statusClass}`}>
            <FontAwesomeIcon icon={isEnded ? faHourglassEnd : isOngoing ? faHourglassHalf : faHourglassStart} />{" "}
            {isEnded ? (
              "ended"
            ) : (
              <>
                <Countdown timer={isOngoing ? props.finalEnd : props.finalStart} /> {isOngoing ? "(ongoing)" : ""}
              </>
            )}
          </h4>
          <h5>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            {props.location}
          </h5>
          <p className="card-text">
            {props.comments} {props.instructor}
          </p>
        </div>
        <div className={`card-footer border-${statusClass}`}>
          <FontAwesomeIcon icon={faClock} /> {props.finalStart.toFormat("ccc, LLL d t")} -{" "}
          {props.finalEnd.toFormat("t")}
        </div>
      </div>
    </div>
  );
};

export default Final;
