import { exhaustMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  loginAction,
  loginSuccessAction,
  loginFailedAction,
} from '../reducers/userReducer';
import { IEpic } from '.';
import { UserManager } from '@src/modules/RxdbManager';

export const loginEpic: IEpic = (action$, store$, { login }) =>
  action$.pipe(
    ofType(loginAction().type),
    exhaustMap((action) =>
      from(login(action.payload)).pipe(
        map((res: PromiseReturnType<typeof login>) => {
          if (res.uid) {
            // 将个人信息存入RxDB
            UserManager.upsert(res);
            return loginSuccessAction(res);
          } else {
            return loginFailedAction();
          }
        })
      )
    )
  );
