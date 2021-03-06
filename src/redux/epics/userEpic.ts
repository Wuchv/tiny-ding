import { exhaustMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  loginAction,
  loginSuccessAction,
  loginFailedAction,
} from '../reducers/userReducer';
import { IEpic, PromiseReturnType } from '.';

export const loginEpic: IEpic = (action$, store$, { login }) =>
  action$.pipe(
    ofType(loginAction().type),
    exhaustMap((action) =>
      from(login(action.payload)).pipe(
        map((res: PromiseReturnType<typeof login>) => {
          if (res.statusCode === 200) {
            return loginSuccessAction(res.payload);
          } else {
            return loginFailedAction(res.message);
          }
        })
      )
    )
  );
