import { h, Fragment, FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Config from '../Config';

const BetaAlert: FunctionalComponent = () => {
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        setShowAlert(true);
    }, []);

    return ( Config.showBetaAlert && showAlert?
        <div className='alert alert-primary alert-dismissible fade show' role='alert'>
            <h4 className='alert-heading' > Public Beta: <a className='alert-link' href='https://github.com/bmiddha/final-countdown'><i className='fab fa-github' /> github.com/bmiddha/final-countdown</a>.</h4>
            <hr />
            <p>
                Install the progressive web app on your phone. Visit <a className='alert-link' href='https://final-countdown.azurewebsites.net'>https://final-countdown.azurewebsites.net</a>.
                </p>
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setShowAlert(false)}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div> : <Fragment></Fragment>
    );
};

export default BetaAlert;
