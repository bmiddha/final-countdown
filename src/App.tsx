import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { FC, useState, useEffect } from 'react';
import Home from './pages/Home';
import MyFinals from './pages/MyFinals';
import ConfigPage from './pages/Config';
import Header from './components/Header';
import Footer from './components/Footer';
import BetaAlert from './components/BetaAlert';
import Config from './Config';

const App: FC = () => {

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
    <Router>
      <Header applyFilter={applyFilter} filter={filterString} />
      <BetaAlert />
      <Switch>
        <Route path='/config'>
          <ConfigPage />
        </Route>
        <Route path='/myfinals'>
          <MyFinals />
        </Route>
        <Route path='/'>
          <Home filter={filterString} viewCount={viewCount} />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
