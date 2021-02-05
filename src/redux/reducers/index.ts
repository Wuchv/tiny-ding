import { combineReducers } from 'redux';
import userReducer, { IUser } from './userReducer';

export interface IRootState {
  user: IUser;
}

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
