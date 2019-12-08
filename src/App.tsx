import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { FC, useState, useEffect } from 'react';
import Home from './pages/Home';
import MyFinals from './pages/MyFinals';
import Config from './pages/Config';
import Header from './components/Header';
import Footer from './components/Footer';
import BetaAlert from './components/BetaAlert';

const App: FC = () => {

  const UserConfigOptions = [
    'filterString'
  ];

  const [filterString, setFilterString] = useState<string>('');

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
    if (filterCache) {
      setFilterString(filterCache);
    }
  }, []);

  return (
    <Router>
      <Header applyFilter={applyFilter} filter={filterString} />
      <BetaAlert />
      <Switch>
        <Route path='/config'>
          <Config />
        </Route>
        <Route path='/myfinals'>
          <MyFinals />
        </Route>
        <Route path='/'>
          <Home filter={filterString} />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
