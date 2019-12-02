import React, { FC, useState, useEffect } from 'react';
import Final, { FinalProps } from './Final';

interface FinalsState {
    rows: number;
    output: FinalProps[];
}

const Finals: FC = () => {
    const [data, setData] = useState<FinalsState>({
        rows: 0,
        output: [],
    });
    useEffect(() => {
        const fetchData = async () => {
            // get term and year
            // const year = await (await fetch('https://xorigin.azurewebsites.net/uicregistrar/assets/api/current-academic-year.json')).json();
            const res: FinalsState = await (await fetch('https://xorigin.azurewebsites.net/uicregistrar/assets/scripts/finals-initial-query.php?term=220198')).json();
            (window as any).res = res;
            // res.output.forEach((e) => console.log(e.course, new Date(`${e.day} 2019 ${e.time.split(' ')[0]} ${e.time.split(' ')[3]}`)));
            res.output = res.output.filter(e => e.course.startsWith("CS "));
            res.output = res.output.slice(0, 100);
            setData(res);
        }
        fetchData();
    }, []);
    return (
        <>
            {data.output.map((f: FinalProps, key: number) =>
                <Final key={key} {...f} />
            )}
        </>
    )
};

export default Finals;

