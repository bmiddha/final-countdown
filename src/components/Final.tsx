import React, { FC, useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import {
  faClock,
  faHourglassEnd,
  faHourglassHalf,
  faHourglassStart,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Config } from '../util';
import { Countdown } from '.';
import { FinalModel } from '../models';

import styles from './Final.module.css';

export type FinalProps = FinalModel;

export const Final: FC<FinalProps> = (props: FinalProps) => {
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
    ? 'success'
    : isOngoing
    ? 'info'
    : +props.finalStart - +new Date() < Config.finalWarningBorderTime
    ? 'primary'
    : '';

  return (
    <Col className="mb-4">
      <Card className={`mx-auto ${statusClass ? `border-${statusClass}` : ''} ${styles.final}`}>
        <Card.Header className={statusClass ? `border-${statusClass}` : ''}>
          <Card.Title>
            {props.department} {props.course} {props.crn}
          </Card.Title>
        </Card.Header>
        <Card.Body className={statusClass ? `border-${statusClass}` : ''}>
          <Card.Subtitle as="h4" className={`mb-4 text-${statusClass}`}>
            <FontAwesomeIcon
              width="16"
              icon={isEnded ? faHourglassEnd : isOngoing ? faHourglassHalf : faHourglassStart}
            />{' '}
            {isEnded ? (
              'ended'
            ) : (
              <>
                <Countdown timer={isOngoing ? props.finalEnd : props.finalStart} /> {isOngoing ? '(ongoing)' : ''}
              </>
            )}
          </Card.Subtitle>
          <h5>
            <FontAwesomeIcon width="16" icon={faMapMarkerAlt} />
            {props.location}
          </h5>
          <p className="card-text">
            {props.comments} {props.instructor}
          </p>
        </Card.Body>
        <Card.Footer className={statusClass ? `border-${statusClass}` : ''}>
          <FontAwesomeIcon width="16" icon={faClock} />{' '}
          {DateTime.fromJSDate(new Date(props.finalStart)).toFormat('ccc, LLL d t')} -{' '}
          {DateTime.fromJSDate(new Date(props.finalEnd)).toFormat('t')}
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default Final;
