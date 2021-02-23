import { Dispatch } from '_@types_react@17.0.1@@types/react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, IUser } from '@src/redux/reducers/userReducer';
import { selectChat, IChat } from '@src/redux/reducers/chatReducer';

export const useReduxData = (): [Dispatch<any>, IUser & IChat] => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const chat = useSelector(selectChat);

  return [dispatch, { ...user, ...chat }];
};
