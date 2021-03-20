import {
  combineEpics,
  ActionsObservable,
  StateObservable,
  Epic,
} from 'redux-observable';
import { catchError } from 'rxjs/operators';
import { PayloadAction } from '@reduxjs/toolkit';
import * as API from '../../services';
import { IRootState } from '../reducers';
import { loginEpic } from './userEpic';
// import { chooseEpic } from './chatEpic';

const epics = [loginEpic];

const rootEpic: IEpic = (
  action$: ActionsObservable<PayloadAction<any>>,
  store$: StateObservable<void>,
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
  void,
  typeof API
>;

export default rootEpic;
