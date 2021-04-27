import React, { FC, useState, useEffect, useCallback } from "react";
import FinalsList from "../components/FinalsList";
import GraduationCountdown from "../components/GraduationCountdown";
import { FinalModel } from "../models/Final";
import GetFinals from "../util/GetFinals";
import GetAcademicYear from "../util/GetAcademicYear";
import { SummerTerm, Term } from "../models/AcademicYearApi";
import Config from "../util/Config";
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
    const applyFilter = () => {
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
    };
    applyFilter();
    const updateInterval = setInterval(applyFilter, Config.homeFinalsListUpdateInterval);
    return () => {
      clearInterval(updateInterval);
    };
  }, [allFinals, filterFinals, filter, viewCount]);

  const clientTZ = DateTime.local().zoneName;

  return (
    <>
      {filterError && (
        <div className="alert alert-info" role="alert">
          {filterError}
        </div>
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
