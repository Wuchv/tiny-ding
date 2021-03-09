import {
  combineEpics,
  ActionsObservable,
  StateObservable,
  Epic,
} from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { PayloadAction } from '@reduxjs/toolkit';
import API from '../../services';
import { IRootState } from '../reducers';
import { loginEpic } from './userEpic';
// import { chooseEpic } from './chatEpic';

const epics = [loginEpic];

const rootEpic: IEpic = (
  action$: ActionsObservable<PayloadAction<any>>,
  store$: StateObservable<IRootState>,
  dependencies: typeof API
) =>
  combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    })
  );

export type IEpic = Epic<
  PayloadAction<any>,
  PayloadAction<any>,
  IRootState,
  typeof API
>;

export default rootEpic;
