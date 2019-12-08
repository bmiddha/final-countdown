import React, { FC } from 'react';
import FinalsList from '../components/FinalsList';

interface HomeProps {
    filter: string;
}

const Home: FC<HomeProps> = ({filter}) => {

    return (
        <>
         <FinalsList filter={filter} />
        </>
    );
};

export default Home;