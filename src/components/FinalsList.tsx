import React, { FC, useState, useEffect, useCallback } from 'react';
import GraduationCountdown from '../components/GraduationCountdown';
import Final from '../components/Final';
import { FinalModel } from '../models/Final';
import GetFinals from '../util/GetFinals';
import GetAcademicYear from '../util/GetAcademicYear';
import { Term } from '../models/AcademicYearApi';

interface FinalsListProps {
    filter: string;
}

const FinalsList: FC<FinalsListProps> = ({filter}) => {

    const [allFinals, setAllFinals] = useState<FinalModel[]>([]);
    const [finals, setFinals] = useState<FinalModel[]>([]);
    const [lastFinal, setLastFinal] = useState<FinalModel>();
    const [term, setTerm] = useState('');

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
        filterFinals(allFinals, filter);
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
            {lastFinal ? <GraduationCountdown term={term} timer={lastFinal.finalEnd} /> : <></>}
            <div className='container-fluid'>
                <div className='card-deck'>
                    {finals.map((f: FinalModel, key: number) =>
                        <Final key={key} {...f} />
                    )}
                </div>
            </div>
        </>
    );
};

export default FinalsList;