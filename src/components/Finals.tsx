import React, { FC } from 'react';
import Final, { FinalProps } from './Final';

interface FinalsProps {
    finals: FinalProps[];
}

const Finals: FC<FinalsProps> = ({ finals }: FinalsProps) => {

    return (
        <div className='container-fluid'>
            <div className='card-deck'>
                {finals.map((f: FinalProps, key: number) =>
                    <Final key={key} {...f} />
                )}
            </div>
        </div>
    )
};

export default Finals;

