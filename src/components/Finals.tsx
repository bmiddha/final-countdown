import React, { FC } from 'react';
import Final, { FinalProps } from './Final';

interface FinalsProps {
    finals: FinalProps[];
}

const Finals: FC<FinalsProps> = ({ finals }: FinalsProps) => {

    return (
        <>
            {finals.map((f: FinalProps, key: number) =>
                <Final key={key} {...f} />
            )}
        </>
    )
};

export default Finals;

