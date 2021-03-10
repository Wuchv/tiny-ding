import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from './index';
import { ILoginRequest } from '../../services/login';
import UserManager from '@src/modules/dbManager/UserManager';

// @ts-ignore:Top-level 'await' expressions are only allowed when the 'module' option is set to 'esnext' or 'system', and the 'target' option is set to 'es2017' or higher.
const initialState: Partial<IUser> = await UserManager.getOwnInfo();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<ILoginRequest>) => {
      state.uid = '';
    },
    loginFailedAction: (state) => {
      state.uid = '';
    },
    loginSuccessAction: (state, action: PayloadAction<Partial<IUser>>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const {
  loginAction,
  loginSuccessAction,
  loginFailedAction,
} = userSlice.actions;

export const selectUser = (state: IRootState) => ({
  uid: state.user.uid,
  avatarUrl: state.user.avatarUrl,
  nickname: state.user.nickname,
});

export default userSlice.reducer;
