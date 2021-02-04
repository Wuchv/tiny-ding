import { combineReducers } from 'redux';
import loginReducer, {
  ILoginState,
  loginAction,
  setUidAction,
} from './loginReducer';

export const actions = {
  beforeLogin: loginAction(),
  afterLogin: setUidAction(),
};
export interface IRootState {
  loginState: ILoginState;
}

const rootReducer = combineReducers({
  loginState: loginReducer,
});

export default rootReducer;
