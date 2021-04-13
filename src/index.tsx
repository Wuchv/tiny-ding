import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import getStoreAsync from '@src/redux';

// import { mockApi } from './mock';
// import { isDev } from './constants';

import { Login } from './pages/Login';
import { Main } from './pages/Main';
import { VideoCall } from './pages/VideoCall';

// if (isDev) {
//   mockApi();
// }

const $root: HTMLElement = document.getElementById('root') || null;

getStoreAsync().then((store) => {
  render(
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/main" component={Main}></Route>
          <Route path="/video-call" component={VideoCall}></Route>
        </Switch>
      </HashRouter>
    </Provider>,
    $root
  );
});
