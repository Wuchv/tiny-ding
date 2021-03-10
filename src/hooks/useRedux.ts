import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@src/redux/reducers/userReducer';
import { selectChat, IChat } from '@src/redux/reducers/chatReducer';

export const useReduxData = (): [Dispatch<any>, Partial<IUser> & IChat] => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const chat = useSelector(selectChat);

  return [dispatch, { ...user, ...chat }];
};
