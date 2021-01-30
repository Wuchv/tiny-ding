import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';
import rootReducer from './reducers';
import API from '../services';

const epicMiddleware = createEpicMiddleware({
  dependencies: API,
});

const middleware = [...getDefaultMiddleware({ thunk: false }), epicMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware,
});
epicMiddleware.run(rootEpic);

export default store;
