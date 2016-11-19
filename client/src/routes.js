import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './containers/App';
import Clients from './containers/Clients';
import Game from './containers/Game';
import Intro from './containers/Intro';
import NotFound from './containers/NotFound';
import Profile from './containers/Profile';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';

export default (/* store */) => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Intro}/>

      <Route path="clients" component={Clients}/>
      <Route path="game" component={Game}/>
      <Route path="intro" component={Intro}/>
      <Route path="profile" component={Profile}/>
      <Route path="signin" component={SignIn}/>
      <Route path="signup" component={SignUp}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
