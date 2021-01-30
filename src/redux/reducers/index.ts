import { combineReducers } from 'redux';
import countReducer, { ICounterState } from './counterReducer';

export interface IRootState {
  counter: ICounterState;
}

const rootReducer = combineReducers({
  counter: countReducer,
});

export default rootReducer;
