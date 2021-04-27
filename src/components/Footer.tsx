import React, { FC } from 'react';

import { faCode, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export type FooterProps = Record<string, never>;

export const Footer: FC<FooterProps> = ({}) => {
  return (
    <Container className="py-4">
      <Col>
        <p className="lead text-center">
          <a href="https://github.com/bmiddha/final-countdown">
            <FontAwesomeIcon width="16" icon={faCode} /> with <FontAwesomeIcon width="16" icon={faHeart} /> by Bharat
            Middha.
            <br />
            <FontAwesomeIcon width="16" icon={faGithub} /> github.com/bmiddha/final-countdown
          </a>
        </p>
      </Col>
    </Container>
  );
};

export default Footer;
