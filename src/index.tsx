import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { mockApi } from './mock';
import { isDev } from './constants';

import { Login } from './pages/Login';
import { Main } from './pages/Main';

if (isDev) {
  mockApi();
}

const $root: HTMLElement = document.getElementById('root') || null;

render(
  <HashRouter>
    <Switch>
      <Route path="/login" component={Login}></Route>
      <Route path="/main" component={Main}></Route>
    </Switch>
  </HashRouter>,
  $root
);
