import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from './index';
import { ILoginRequest } from '../../services/login';

export interface IUser {
  uid: string;
  err: string;
}

const initialState: IUser = {
  uid: '',
  err: '',
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
    loginSuccessAction: (state, action: PayloadAction<string>) => {
      state.uid = action.payload;
    },
  },
});

export const {
  loginAction,
  loginSuccessAction,
  loginFailedAction,
} = userSlice.actions;

export const selectUser = (state: IRootState) => ({
  uid: state.user.uid,
  err: state.user.err,
});

export default userSlice.reducer;
