import React, { FC, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import Spinner from 'react-bootstrap/Spinner';
import useSWR from 'swr';

import { DataApiResponse, FinalModel, SummerTerm, Term } from '../models';
import { FinalsList, Footer, GraduationCountdown, Header } from '../components';
import { Config } from '../util';

type HomeProps = Record<string, never>;

const Home: FC<HomeProps> = ({}) => {
  const [finals, setFinals] = useState<FinalModel[]>();
  const [endOfFinals, setEndOfFinals] = useState<number>();
  const [term, setTerm] = useState<string>('');
  const [filterError, setFilterError] = useState<string>();
  const [filterString, setFilterString] = useState<string>(Config.defaultFilterString);

  const { data, isValidating } = useSWR<DataApiResponse>('/api/data');

  const viewCount = Config.defaultViewCount;

  const applyFilter = (_filterString: string) => {
    setFilterString(_filterString);
  };

  useEffect(() => {
    if (data) {
      let nearestTerm: Term | SummerTerm | undefined;

      if (
        +new Date() > data.academicYear.terms.spring.instruction.start.timestamp * 1000 &&
        +new Date() < data.academicYear.terms.spring.finals.stop.timestamp * 1000
      ) {
        nearestTerm = data.academicYear.terms.spring;
      } else if (
        +new Date() > data.academicYear.terms.fall.instruction.start.timestamp * 1000 &&
        +new Date() < data.academicYear.terms.fall.finals.stop.timestamp * 1000
      ) {
        nearestTerm = data.academicYear.terms.fall;
      } else if (
        (+new Date() > data.academicYear.terms.summer.instruction.session_1.start.timestamp * 1000 &&
          +new Date() < data.academicYear.terms.summer.finals.session_1.stop.timestamp * 1000) ||
        (+new Date() > data.academicYear.terms.summer.instruction.session_2.start.timestamp * 1000 &&
          +new Date() < data.academicYear.terms.summer.finals.session_2.stop.timestamp * 1000)
      ) {
        nearestTerm = data.academicYear.terms.summer;
      }

      if (nearestTerm) {
        setTerm(nearestTerm.term_data.name);
        if ('session_1' in (nearestTerm as SummerTerm).finals) {
          setEndOfFinals((nearestTerm as SummerTerm).finals.session_1.stop.timestamp_eod * 1000);
        } else if ('session_2' in (nearestTerm as SummerTerm).finals) {
          setEndOfFinals((nearestTerm as SummerTerm).finals.session_2.stop.timestamp_eod * 1000);
        } else {
          setEndOfFinals((nearestTerm as Term).finals.stop.timestamp_eod * 1000);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      try {
        const _filterString = filterString && filterString.length > 0 ? filterString : '.*';
        const filtered = data.allFinals
          .filter((f) => `${f.department} ${f.course} ${f.crn}`.match(new RegExp(_filterString, 'i')))
          .filter((e) => e.finalEnd > DateTime.local().toMillis())
          .sort((e1, e2) => e1.finalStart - e2.finalStart)
          .splice(0, viewCount);
        setFinals(filtered);
        setFilterError('');
      } catch (e) {
        setFilterError('Invalid Regular expression. Check filter string.');
        setFinals([]);
      }
    }
  }, [data, filterString, viewCount]);

  const clientTZ = DateTime.local().zoneName;

  return (
    <>
      <div>
        <Header applyFilter={applyFilter} filter={filterString} />
      </div>
      <div>
        {filterError && (
          <div role="alert" className="alert alert-info">
            {filterError}
          </div>
        )}
        {clientTZ !== 'America/Chicago' && (
          <div role="alert" className="alert alert-info">
            Your timezone is {clientTZ}. The schedule has been adjusted for your timezone.
          </div>
        )}
      </div>
      <div>{endOfFinals ? <GraduationCountdown term={term} timer={endOfFinals} /> : <></>}</div>
      <div>
        {isValidating && (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
        {finals && <FinalsList finals={finals} />}
      </div>
      <Footer />
    </>
  );
};

export default Home;
