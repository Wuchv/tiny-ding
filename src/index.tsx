import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Login } from './components/Login';

const $root: HTMLElement = document.getElementById('root') || null;

render(
  <HashRouter>
    <Switch>
      <Route path="/login" component={Login}></Route>
    </Switch>
  </HashRouter>,
  $root
);
