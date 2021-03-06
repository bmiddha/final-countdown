import React, { FC } from 'react';

import CardDeck from 'react-bootstrap/CardDeck';
import Container from 'react-bootstrap/Container';

import { Final } from '../components';
import { FinalModel } from '../models';

export type FinalsListProps = {
  finals: FinalModel[];
};

export const FinalsList: FC<FinalsListProps> = ({ finals }) => (
  <>
    <Container fluid>
      <CardDeck>
        {finals.map((f: FinalModel, key: number) => (
          <Final key={key} {...f} />
        ))}
      </CardDeck>
    </Container>
  </>
);

export default FinalsList;
