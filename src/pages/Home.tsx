import React, { FC, useState, useEffect, useCallback } from 'react';
import Countdown from '../components/Countdown';
import Finals from '../components/Finals';
import { FinalProps } from '../components/Final';
import * as AcademicYearApi from '../models/AcademicYearApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

interface FinalsApiResponseArray {
    type: string;
    course: string;
    day: string;
    time: string;
    building: string;
    rooms: string;
    comments: string;
}

interface FinalsApiResponse {
    rows: number;
    output: FinalsApiResponseArray[];
}

const UserConfigOptions = [
    'filterString'
]

const Home: FC = () => {

    const [allFinals, setAllFinals] = useState<FinalProps[]>([]);
    const [finals, setFinals] = useState<FinalProps[]>([]);
    const [filterString, setFilterString] = useState<string>('');
    const [lastFinal, setLastFinal] = useState<FinalProps>();
    const [term, setTerm] = useState('');
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // get term and year
            const academicYear: AcademicYearApi.Response = await (await fetch('https://xorigin.azurewebsites.net/uicregistrar/assets/api/current-academic-year.json')).json();
            (window as any).academicYear = academicYear; // for debugging

            let nearestTerm: AcademicYearApi.Term = academicYear.terms.fall;
            // TODO: Add support for summer semester
            if (+new Date() - (academicYear.terms.spring.finals.start.timestamp * 1000) > 0 &&
                +new Date() - (academicYear.terms.spring.finals.start.timestamp * 1000) < +new Date() - (nearestTerm.finals.start.timestamp)) {
                nearestTerm = academicYear.terms.spring;
            }

            setTerm(nearestTerm.term_data.name);

            const res: FinalsApiResponse = await (await fetch(`https://xorigin.azurewebsites.net/uicregistrar/assets/scripts/finals-initial-query.php?term=${nearestTerm.term_data.term_code}`)).json();
            (window as any).rawFinals = res; // for debugging
            const finals = res.output.map((e): FinalProps => {
                const date = `${e.day} 2019`;
                let startTimeHour = e.time.split(' ')[0].split(':')[0];
                const startTimeMinute = e.time.split(' ')[0].split(':')[1];
                let endTimeHour = e.time.split(' ')[2].split(':')[0];
                const endTimeMinute = e.time.split(' ')[2].split(':')[1];
                const amPmStr = e.time.split(' ')[3];
                if (amPmStr === 'pm' || amPmStr === 'PM') {
                    if (parseInt(startTimeHour) > parseInt(endTimeHour))
                        startTimeHour = `${parseInt(startTimeHour) + 12}`
                    else if (parseInt(endTimeHour) !== 12) {
                        endTimeHour = `${parseInt(endTimeHour) + 12}`
                        startTimeHour = `${parseInt(startTimeHour) + 12}`
                    }
                }
                const finalStart = new Date(`${date} ${startTimeHour}:${startTimeMinute}`);
                const finalEnd = new Date(`${date} ${endTimeHour}:${endTimeMinute}`);
                const courseSplit = e.course.split(' ').filter(e => e.length !== 0);
                return {
                    finalStart, finalEnd,
                    location: `${e.building} ${e.rooms}`,
                    department: courseSplit[0],
                    crn: courseSplit[3],
                    course: courseSplit[1],
                    comments: e.comments,
                    type: e.type
                };
            })
                .filter(e => +e.finalEnd > +new Date())
                .sort((e1, e2) => +e1.finalStart - +e2.finalStart);
            setLastFinal(finals.reduce((acc, f) => {
                if (!acc) {
                    return f;
                } else if (+f.finalEnd > +acc.finalEnd) {
                    return f;
                } else {
                    return acc;
                }
            }));
            (window as any).finals = finals; // for more debugging
            setAllFinals(finals);
        };
        if (window.location.search.length !== 0) {
            const search = window.location.search.substring(1);
            const params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
            Object.keys(params).forEach(key => {
                if (UserConfigOptions.indexOf(key) !== -1 && params[key].trim().length !== 0) {
                    localStorage.setItem(key, decodeURIComponent(params[key]));
                }
            });
            window.location.href = '/';
        }
        setShowAlert(true);
        fetchData();
    }, []);

    const filterFinals = useCallback((list: FinalProps[], f: string) => {
        const regex = new RegExp(f, 'g');
        setFinals(list.filter(f => (`${f.department} ${f.course} ${f.crn}`).match(regex)).sort((e1, e2) => +e1.finalStart - +e2.finalStart));
    }, []);

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setFinals(finals.filter(e => +e.finalEnd > +new Date()));
        }, 15 * 60 * 1000);
        return (() => {
            clearInterval(updateInterval);
        });
    }, [finals]);

    useEffect(() => {
        const filterCache = window.localStorage.getItem('filterString');
        if (filterCache) {
            setFilterString(filterCache);
            filterFinals(allFinals, filterCache);
        }
    }, [allFinals, filterFinals]);

    const updateFilterString = (e: React.FormEvent<HTMLInputElement>) => {
        setFilterString(e.currentTarget.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.localStorage.setItem('filterString', filterString);
        filterFinals(allFinals, filterString);
    };

    return (
        <>
            <nav className='navbar navbar-light bg-light'>
                <a className='navbar-brand' href='/'><img src='/icon-120.png' width='30' height='30' alt='' /> Final Countdown</a>
                <form className='form-inline' onSubmit={handleSubmit}>
                    <input className='form-control mr-sm-2' type='search' placeholder='Regex Filter' aria-label='Regex Filter' value={filterString} onChange={updateFilterString} />
                    <button className='btn btn-outline-success my-2 my-sm-0' type='submit'>Filter</button>
                </form>
            </nav>
            {showAlert ?
                <div className='alert alert-primary alert-dismissible fade show' role='alert'>
                    <h4 className='alert-heading'>Public Beta: <a className='alert-link' href='https://github.com/bmiddha/final-countdown'><FontAwesomeIcon icon={faGithub} /> github.com/bmiddha/final-countdown</a>.</h4>
                    <hr />
                    <p>
                        Install the progressive web app on your phone. Visit <a className='alert-link' href='https://final-countdown.azurewebsites.net'>https://final-countdown.azurewebsites.net</a>.
                </p>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setShowAlert(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div> : <></>}
            <div className='container py-4'>
                <div className='col'>
                    <h1 className='m-4 text-center'>{lastFinal ? <>{term} Graduation <span className='countdown'><Countdown endMessage='Yay' timer={lastFinal.finalEnd} /></span></> : <></>}</h1>
                </div>
            </div>
            <Finals finals={finals} />
            <footer className='container py-4'>
                <div className='col'>
                    <p className='lead text-center'>
                        <a href='https://github.com/bmiddha/final-countdown'><FontAwesomeIcon icon={faGithub} /> github.com/bmiddha/final-countdown</a>
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Home;