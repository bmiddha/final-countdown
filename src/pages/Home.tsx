import React, { FC } from 'react';
import Countdown from '../components/Countdown';
import Finals from '../components/Finals';

const Home: FC = () => {

    const semester = "";
    const year = "";
    return (
        <>
            <div id="topbar" className="lightCoolShadow">
                <h1>{semester} {year} Graduation | <Countdown endMessage="Yay" timer={new Date('2019-12-2 02:00:00')} /></h1>
            </div>
            <div id="finalsContainer">
                <Finals />
            </div>
            <footer className='lightCoolShadow'>
                <a href='https://github.com/bmiddha/final-countdown'>github.com/bmiddha/final-countdown</a>
            </footer>
        </>
    );
};

export default Home;