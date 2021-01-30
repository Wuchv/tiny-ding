import { mapTo } from 'rxjs/operators';
import { ofType, ActionsObservable } from 'redux-observable';
import { increment, decrement } from '../reducers/counterReducer';

interface IAction {
  type: string;
  payload: any;
}

export const addEpic = (action$: ActionsObservable<IAction>) =>
  action$.pipe(ofType(increment().type), mapTo(decrement()));
