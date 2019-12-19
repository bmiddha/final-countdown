import { h, Fragment, FunctionalComponent } from 'preact';
import Final from '../components/Final';
import { FinalModel } from '../models/Final';

interface FinalsListProps {
    finals: FinalModel[];
}

const FinalsList: FunctionalComponent<FinalsListProps> = ({ finals }) => (
    <Fragment>
        <div className='container-fluid'>
            <div className='card-deck'>
                {finals.map((f: FinalModel, key: number) =>
                    <Final key={key} {...f} />
                )}
            </div>
        </div>
    </Fragment>
);

export default FinalsList;
