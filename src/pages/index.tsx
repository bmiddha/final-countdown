import React, { FC, useCallback, useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import { Config, GetAcademicYear, GetFinals } from '../util';
import { FinalModel, SummerTerm, Term } from '../models';
import { FinalsList, Footer, GraduationCountdown, Header } from '../components';

type HomeProps = Record<string, never>;

const Home: FC<HomeProps> = ({}) => {
  const [allFinals, setAllFinals] = useState<FinalModel[]>([]);
  const [finals, setFinals] = useState<FinalModel[]>([]);
  const [endOfFinals, setEndOfFinals] = useState<DateTime>();
  const [term, setTerm] = useState<string>('');
  const [filterError, setFilterError] = useState<string>();

  const UserConfigOptions = ['filterString', 'viewCount'];

  const [filterString, setFilterString] = useState<string>(Config.defaultFilterString);
  const [viewCount, setViewCount] = useState<number>(Config.defaultViewCount);

  if (typeof window !== 'undefined') {
    if (window.location.search.length !== 0) {
      const search = window.location.search.substring(1);
      const params = JSON.parse(
        '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
      );
      Object.keys(params).forEach((key) => {
        if (UserConfigOptions.indexOf(key) !== -1 && params[key].trim().length !== 0) {
          localStorage.setItem(key, decodeURIComponent(params[key]));
        }
      });
      window.location.href = window.location.pathname;
    }
  }

  const applyFilter = (_filterString: string) => {
    setFilterString(_filterString);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('filterString', _filterString);
    }
  };

  useEffect(() => {
    const filterCache = window.localStorage.getItem('filterString');
    const viewCount = window.localStorage.getItem('viewCount');
    if (filterCache) {
      setFilterString(filterCache);
    }
    if (viewCount && parseInt(viewCount)) {
      setViewCount(parseInt(viewCount));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const academicYear = await GetAcademicYear();

      let nearestTerm: Term | SummerTerm | undefined;

      if (
        +new Date() > academicYear.terms.spring.instruction.start.timestamp * 1000 &&
        +new Date() < academicYear.terms.spring.finals.stop.timestamp * 1000
      ) {
        nearestTerm = academicYear.terms.spring;
      } else if (
        +new Date() > academicYear.terms.fall.instruction.start.timestamp * 1000 &&
        +new Date() < academicYear.terms.fall.finals.stop.timestamp * 1000
      ) {
        nearestTerm = academicYear.terms.fall;
      } else if (
        (+new Date() > academicYear.terms.summer.instruction.session_1.start.timestamp * 1000 &&
          +new Date() < academicYear.terms.summer.finals.session_1.stop.timestamp * 1000) ||
        (+new Date() > academicYear.terms.summer.instruction.session_2.start.timestamp * 1000 &&
          +new Date() < academicYear.terms.summer.finals.session_2.stop.timestamp * 1000)
      ) {
        nearestTerm = academicYear.terms.summer;
      }

      if (nearestTerm) {
        setTerm(nearestTerm.term_data.name);
        if ('session_1' in (nearestTerm as SummerTerm).finals) {
          setEndOfFinals(DateTime.fromMillis((nearestTerm as SummerTerm).finals.session_1.stop.timestamp_eod * 1000));
        } else if ('session_2' in (nearestTerm as SummerTerm).finals) {
          setEndOfFinals(DateTime.fromMillis((nearestTerm as SummerTerm).finals.session_2.stop.timestamp_eod * 1000));
        } else {
          setEndOfFinals(DateTime.fromMillis((nearestTerm as Term).finals.stop.timestamp_eod * 1000));
        }
        const finals = await GetFinals(nearestTerm.term_data.term_code);
        setAllFinals(finals);
      }
    };
    fetchData();
  }, []);

  const filterFinals = useCallback(
    (list: FinalModel[], regex: RegExp) => {
      setFinals(
        list
          .filter((f) => `${f.department} ${f.course} ${f.crn}`.match(regex))
          .filter((e) => +e.finalEnd > +DateTime.local())
          .sort((e1, e2) => +e1.finalStart - +e2.finalStart)
          .splice(0, viewCount)
      );
    },
    [viewCount]
  );

  useEffect(() => {
    const _applyFilter = () => {
      const isFilterEmpty = filterString.length === 0;
      if (isFilterEmpty) setFilterError('No filter specified. Please specify a filter.');
      else {
        try {
          filterFinals(allFinals, new RegExp(isFilterEmpty ? '^$' : filterString, 'i'));
          setFilterError(undefined);
        } catch (_) {
          setFilterError('Invalid filter expression.');
        }
      }
    };
    _applyFilter();
    const updateInterval = setInterval(_applyFilter, Config.homeFinalsListUpdateInterval);
    return () => {
      clearInterval(updateInterval);
    };
  }, [allFinals, filterFinals, filterString, viewCount]);

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
        <FinalsList finals={finals} />
      </div>
      <Footer />
    </>
  );
};

export default Home;
