import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from './index';
import { ILoginRequest } from '../../services/login';

export interface ILoginState {
  uid: string;
}

const initialState: ILoginState = {
  uid: '',
};

const loginSlice = createSlice({
  name: 'loginState',
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<ILoginRequest>) => {
      state.uid = '';
    },
    setUidAction: (state, action: PayloadAction<string>) => {
      state.uid = action.payload;
    },
  },
});

export const { loginAction, setUidAction } = loginSlice.actions;

export const selectUid = (state: IRootState) => state.loginState.uid;

export default loginSlice.reducer;
