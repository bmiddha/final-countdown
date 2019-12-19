import { h, Fragment, FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Router, RouterOnChangeArgs } from 'preact-router';
import 'bootswatch/dist/simplex/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from '../pages/Home';
import MyFinals from '../pages/MyFinals';
import ConfigPage from '../pages/Config';
import Header from './Header';
import Footer from './Footer';
import BetaAlert from './BetaAlert';
import Config from '../Config';

if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require('preact/debug');
}

const App: FunctionalComponent = () => {

    let currentUrl: string;
    const handleRoute = (e: RouterOnChangeArgs) => {
        currentUrl = e.url;
    };

    // return (
    //     <div id='app'>
    //         <Header />
    //         <Router onChange={handleRoute}>
    //             <Route path='/' component={Home} />
    //             <Route path='/profile/' component={Profile} user='me' />
    //             <Route path='/profile/:user' component={Profile} />
    //         </Router>
    //     </div>
    // );
    const UserConfigOptions = [
        'filterString',
        'viewCount'
    ];

    const [filterString, setFilterString] = useState<string>(Config.defaultFilterString);
    const [viewCount, setViewCount] = useState<number>(Config.defaultViewCount);

    if (window.location.search.length !== 0) {
        const search = window.location.search.substring(1);
        const params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        Object.keys(params).forEach(key => {
            if (UserConfigOptions.indexOf(key) !== -1 && params[key].trim().length !== 0) {
                localStorage.setItem(key, decodeURIComponent(params[key]));
            }
        });
        window.location.href = window.location.pathname;
    }

    const applyFilter = (_filterString: string) => {
        setFilterString(_filterString);
        window.localStorage.setItem('filterString', _filterString);
    };

    useEffect(() => {
        const filterCache = window.localStorage.getItem('filterString');
        const viewCount = window.localStorage.getItem('viewCount');
        if (filterCache) {
            setFilterString(filterCache);
        }
        if (viewCount && parseInt(viewCount)) {
            setViewCount(parseInt(viewCount));
        }
    }, []);

    return (
        <Fragment>
            <Header applyFilter={applyFilter} filter={filterString} />
            <BetaAlert />
            <Router onChange={handleRoute}>
                <ConfigPage path='/config' />
                <MyFinals path='/myfinals' />
                <Home path='/' filter={filterString} viewCount={viewCount} />
            </Router>
            <Footer />
        </Fragment>
    );
};

export default App;
