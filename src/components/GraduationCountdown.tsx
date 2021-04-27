import { DateTime } from 'luxon';
import React, { FC } from 'react';
import Countdown from './Countdown';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

export type GraduationCountdownProps = {
  term: string;
  timer: DateTime;
};

export const GraduationCountdown: FC<GraduationCountdownProps> = ({ term, timer }: GraduationCountdownProps) => (
  <Container className="py-4">
    <Col>
      <h1 className="m-4 text-center">
        {term} Graduation{' '}
        <span className="countdown">
          <Countdown endMessage="🎉" timer={timer} />
        </span>
      </h1>
    </Col>
  </Container>
);

export default GraduationCountdown;
