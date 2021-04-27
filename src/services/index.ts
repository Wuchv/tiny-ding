import { CustomAxios } from '@src/modules/RemoteGlobal';

const fetch = new CustomAxios();
export interface ILoginRequest {
  account: string;
  password: string;
  username: string;
}

export const login = (data: ILoginRequest, fn?: Function): Promise<IUser> =>
  fetch.post('/api/user/login', data, fn);

export const getAllUsers = (fn?: Function): Promise<IUser[]> =>
  fetch.get('/api/user/allUsers', null, fn);
