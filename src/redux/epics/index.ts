import {
  combineEpics,
  ActionsObservable,
  StateObservable,
} from 'redux-observable';
import { catchError } from 'rxjs/operators';
import API from '../../services';
import { addEpic } from './counterEpic';

const epics = [addEpic];

const rootEpic = (
  action$: ActionsObservable<any>,
  store$: StateObservable<void>,
  dependencies: typeof API
) =>
  combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    })
  );

export default rootEpic;
