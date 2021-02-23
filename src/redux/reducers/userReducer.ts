import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from './index';
import { ILoginRequest } from '../../services/login';

export interface IUser {
  err: string;
  uid: string;
  nickname?: string;
  avatarUrl?: string;
}

const initialState: IUser = {
  uid: '',
  err: '',
  nickname: '',
  avatarUrl: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<ILoginRequest>) => {
      state.uid = '';
      state.err = '';
    },
    loginFailedAction: (state, action: PayloadAction<string>) => {
      state.err = action.payload;
    },
    loginSuccessAction: (state, action: PayloadAction<IUser>) => ({
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
  err: state.user.err,
  uid: state.user.uid,
  avatarUrl: state.user.avatarUrl,
  nickname: state.user.nickname,
});

export default userSlice.reducer;
