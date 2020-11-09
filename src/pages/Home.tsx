import React, { FC, useState, useEffect, useCallback } from "react";
import FinalsList from "../components/FinalsList";
import GraduationCountdown from "../components/GraduationCountdown";
import { FinalModel } from "../models/Final";
import GetFinals from "../util/GetFinals";
import GetAcademicYear from "../util/GetAcademicYear";
import { Term } from "../models/AcademicYearApi";
import Config from "../Config";
import { DateTime } from "luxon";

interface HomeProps {
  filter: string;
  viewCount: number;
}

const Home: FC<HomeProps> = ({ filter, viewCount }) => {
  const [allFinals, setAllFinals] = useState<FinalModel[]>([]);
  const [finals, setFinals] = useState<FinalModel[]>([]);
  const [endOfFinals, setEndOfFinals] = useState<DateTime>();
  const [term, setTerm] = useState<string>("");
  const [filterError, setFilterError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const academicYear = await GetAcademicYear();
      let nearestTerm: Term = academicYear.terms.fall;
      // TODO: Add support for summer semester
      if (
        +new Date() - academicYear.terms.spring.finals.start.timestamp * 1000 > 0 &&
        +new Date() - academicYear.terms.spring.finals.start.timestamp * 1000 <
          +new Date() - nearestTerm.finals.start.timestamp
      ) {
        nearestTerm = academicYear.terms.spring;
      }
      setTerm(nearestTerm.term_data.name);
      setEndOfFinals(DateTime.fromMillis(nearestTerm.finals.stop.timestamp_eod * 1000));
      const finals = await GetFinals(nearestTerm.term_data.term_code);
      setAllFinals(finals);
    };
    fetchData();
  }, []);

  const filterFinals = useCallback(
    (list: FinalModel[], regex: RegExp) => {
      setFinals(
        list
          .filter((f) => `${f.department} ${f.course} ${f.crn}`.match(regex))
          .filter((e) => +e.finalEnd > +new Date())
          .sort((e1, e2) => +e1.finalStart - +e2.finalStart)
          .splice(0, viewCount)
      );
    },
    [viewCount]
  );

  useEffect(() => {
    const isFilterEmpty = filter.length === 0;
    if (isFilterEmpty) setFilterError("No filter specified. Please specify a filter.");
    else {
      try {
        filterFinals(allFinals, new RegExp(isFilterEmpty ? "^$" : filter, "i"));
        setFilterError(undefined);
      } catch (_) {
        setFilterError("Invalid filter expression.");
      }
    }
  }, [allFinals, filterFinals, filter, viewCount]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      try {
        filterFinals(finals, /filter/i);
        setFilterError(undefined);
      } catch (_) {
        setFilterError("Invalid filter expression.");
      }
    }, Config.homeFinalsListUpdateInterval);
    return () => {
      clearInterval(updateInterval);
    };
  }, [finals, filterFinals, filter, viewCount]);

  const clientTZ = DateTime.local().zoneName;

  return (
    <>
      {filterError ? (
        <div className="alert alert-info" role="alert">
          {filterError}
        </div>
      ) : (
        <></>
      )}
      {clientTZ !== "America/Chicago" && (
        <div className="alert alert-info" role="alert">
          Your timezone is {clientTZ}. The schedule has been adjusted for your timezone.
        </div>
      )}
      {endOfFinals ? <GraduationCountdown term={term} timer={endOfFinals} /> : <></>}
      <FinalsList finals={finals} />
    </>
  );
};

export default Home;
