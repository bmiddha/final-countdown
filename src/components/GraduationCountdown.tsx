import React, { FC } from 'react';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { Countdown, CountdownProps } from './Countdown';

export type GraduationCountdownProps = {
  term: string;
} & CountdownProps;

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
