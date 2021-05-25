import { switchMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  loginAction,
  loginSuccessAction,
  loginFailedAction,
} from '../reducers/userReducer';
import { IEpic } from '.';
import { UserManager, MessageCenter } from '@src/modules/RemoteGlobal';

export const loginEpic: IEpic = (action$, store$, { login }) =>
  action$.pipe(
    ofType(loginAction().type),
    switchMap((action) =>
      from(login(action.payload)).pipe(
        map((res: PromiseReturnType<typeof login>) => {
          if (res.uid) {
            // 将个人信息存入RxDB，初始化socket
            UserManager.upsert(res).then(() => MessageCenter.initSocket());
            return loginSuccessAction(res);
          } else {
            return loginFailedAction();
          }
        })
      )
    )
  );
