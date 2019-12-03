import React from 'react';
import Home from './pages/Home';
import Config from './pages/Config';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path='/config' component={Config} />
        <Route path='/' component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
