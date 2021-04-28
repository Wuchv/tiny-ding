import CustomAxios from '../modules/CustomAxios';

const fetch = new CustomAxios();

export interface ILoadMessageRequest {
  uid: string;
  timestamp: number;
}

export const loadUnreadMessage = (
  data: ILoadMessageRequest
): Promise<IMessage[]> => fetch.get('/api/message/unreadMessage', data);
