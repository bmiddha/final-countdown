import React, { FC } from 'react';
import Final, { FinalProps } from './Final';

interface FinalsProps {
    finals: FinalProps[];
}

const Finals: FC<FinalsProps> = ({ finals }: FinalsProps) => {

    return (
        <div className="container">
            <div className="row">
                {finals.map((f: FinalProps, key: number) =>
                    <Final key={key} {...f} />
                )}
            </div>
        </div>
    )
};

export default Finals;

