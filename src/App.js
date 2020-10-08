import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from './component/Navbar';
import Login from './component/Login';
import Users from './component/Users';
import ErrorPage from './component/ErrorPage';

function App() {
  return (
    <div className="app">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/users" component={Users} />
          <Route component={ErrorPage} />
        </Switch>
    </div>
  );
}

export default App;
