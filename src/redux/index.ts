import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import rootEpic from './epics';
import rootReducer from './reducers';
import * as API from '../services';

const getStoreAsync = async () => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: API,
  });

  const middleware = [
    ...getDefaultMiddleware({ thunk: false }),
    epicMiddleware,
    logger,
  ];

  const store = configureStore({
    reducer: rootReducer,
    middleware,
  });
  epicMiddleware.run(rootEpic);

  return store;
};

export default getStoreAsync;
