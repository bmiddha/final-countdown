import React, { FC, useState, useEffect, useCallback } from 'react';
import FinalsList from '../components/FinalsList';
import GraduationCountdown from '../components/GraduationCountdown';
import { FinalModel } from '../models/Final';
import GetFinals from '../util/GetFinals';
import GetAcademicYear from '../util/GetAcademicYear';
import { Term } from '../models/AcademicYearApi';

interface HomeProps {
    filter: string;
}

const Home: FC<HomeProps> = ({ filter }) => {

    const [allFinals, setAllFinals] = useState<FinalModel[]>([]);
    const [finals, setFinals] = useState<FinalModel[]>([]);
    const [lastFinal, setLastFinal] = useState<FinalModel>();
    const [term, setTerm] = useState<string>('');
    const [noFilter, setNoFilter] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const academicYear = await GetAcademicYear();
            let nearestTerm: Term = academicYear.terms.fall;
            // TODO: Add support for summer semester
            if (+new Date() - (academicYear.terms.spring.finals.start.timestamp * 1000) > 0 &&
                +new Date() - (academicYear.terms.spring.finals.start.timestamp * 1000) < +new Date() - (nearestTerm.finals.start.timestamp)) {
                nearestTerm = academicYear.terms.spring;
            }
            setTerm(nearestTerm.term_data.name);
            const finals = await GetFinals(nearestTerm.term_data.term_code);
            setLastFinal(finals.reduce((acc, f) => {
                if (!acc) {
                    return f;
                } else if (+f.finalEnd > +acc.finalEnd) {
                    return f;
                } else {
                    return acc;
                }
            }));
            setAllFinals(finals);
        };
        fetchData();
    }, []);

    const filterFinals = useCallback((list: FinalModel[], f: string) => {
        const regex = new RegExp(f, 'g');
        setFinals(list.filter(f => (`${f.department} ${f.course} ${f.crn}`).match(regex)).sort((e1, e2) => +e1.finalStart - +e2.finalStart));
    }, []);

    useEffect(() => {
        const isFilterEmpty = (filter.length === 0);
        setNoFilter(isFilterEmpty);
        filterFinals(allFinals, isFilterEmpty ? '^$' : filter);
    }, [allFinals, filterFinals, filter]);

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setFinals(finals.filter(e => +e.finalEnd > +new Date()));
        }, 15 * 60 * 1000);
        return (() => {
            clearInterval(updateInterval);
        });
    }, [finals]);

    return (
        <>
            {noFilter ? <div className='alert alert-info' role='alert'>
                No filter specified. Please specify a filter.
            </div> : <></>}
            {lastFinal ? <GraduationCountdown term={term} timer={lastFinal.finalEnd} /> : <></>}
            <FinalsList finals={finals} />
        </>
    );
};

export default Home;