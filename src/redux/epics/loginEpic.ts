import { exhaustMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import { loginAction, setUidAction } from '../reducers/loginReducer';
import { IEpic, PromiseReturnType } from '.';

export const loginEpic: IEpic = (action$, store$, { login }) =>
  action$.pipe(
    ofType(loginAction().type),
    exhaustMap((action) =>
      from(login(action.payload)).pipe(
        map((res: PromiseReturnType<typeof login>) => setUidAction(res.uid))
      )
    )
  );
