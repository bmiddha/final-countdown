import React, { FC } from 'react';
import Final from '../components/Final';
import { FinalModel } from '../models/Final';

interface FinalsListProps {
    finals: FinalModel[];
}

const FinalsList: FC<FinalsListProps> = ({ finals }) => (
    <>
        <div className='container-fluid'>
            <div className='card-deck'>
                {finals.map((f: FinalModel, key: number) =>
                    <Final key={key} {...f} />
                )}
            </div>
        </div>
    </>
);

export default FinalsList;
