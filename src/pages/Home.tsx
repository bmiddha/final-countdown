import { h, Fragment, FunctionalComponent } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import FinalsList from '../components/FinalsList';
import GraduationCountdown from '../components/GraduationCountdown';
import { FinalModel } from '../models/Final';
import GetFinals from '../util/GetFinals';
import GetAcademicYear from '../util/GetAcademicYear';
import { Term } from '../models/AcademicYearApi';
import Config from '../Config';

interface HomeProps {
    filter: string;
    viewCount: number;
}

const Home: FunctionalComponent<HomeProps> = ({ filter, viewCount }) => {

    const [allFinals, setAllFinals] = useState<FinalModel[]>([]);
    const [finals, setFinals] = useState<FinalModel[]>([]);
    const [endOfFinals, setEndOfFinals] = useState<Date>(new Date());
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
            setEndOfFinals(new Date(nearestTerm.finals.stop.timestamp_eod * 1000));
            const finals = await GetFinals(nearestTerm.term_data.term_code);
            setAllFinals(finals);
        };
        fetchData();
    }, []);

    const filterFinals = useCallback((list: FinalModel[], f: string) => {
        const regex = new RegExp(f, 'i');
        setFinals(list.filter(f => (`${f.department} ${f.course} ${f.crn}`).match(regex)).filter(e => +e.finalEnd > +new Date()).sort((e1, e2) => +e1.finalStart - +e2.finalStart).splice(0, viewCount));
    }, [viewCount]);

    useEffect(() => {
        const isFilterEmpty = (filter.length === 0);
        setNoFilter(isFilterEmpty);
        filterFinals(allFinals, isFilterEmpty ? '^$' : filter);
    }, [allFinals, filterFinals, filter, viewCount]);

    useEffect(() => {
        const updateInterval = setInterval(() => {
            filterFinals(finals, filter);
        }, Config.homeFinalsListUpdateInterval);
        return (() => {
            clearInterval(updateInterval);
        });
    }, [finals, filterFinals, filter, viewCount]);

    return (
        <Fragment>
            {noFilter ? <div className='alert alert-info' role='alert'>
                No filter specified. Please specify a filter.
            </div> : <Fragment></Fragment>}
            {endOfFinals ? <GraduationCountdown term={term} timer={endOfFinals} /> : <Fragment></Fragment>}
            <FinalsList finals={finals} />
        </Fragment>
    );
};

export default Home;