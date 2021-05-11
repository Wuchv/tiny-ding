import CustomAxios from '../modules/CustomAxios';

const fetch = new CustomAxios();

export interface ILoadMessageRequest {
  uid: string;
}

export const loadUnreadMessage = (
  data: ILoadMessageRequest
): Promise<IMessage[]> => fetch.get('/api/message/unreadMessage', data);

export interface IOfflineRequest {
  uid: string;
  timestamp: number;
}

export const offline = (data: IOfflineRequest, fn?: Function): Promise<null> =>
  fetch.put('/api/user/offline', data, fn);
