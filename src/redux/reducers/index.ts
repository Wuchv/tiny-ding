import { combineReducers } from 'redux';
import userReducer from './userReducer';
import chatReducer, { IChat } from './chatReducer';

export interface IRootState {
  user: IUser;
  chat: IChat;
}

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

export default rootReducer;
