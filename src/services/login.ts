import Http from '../modules/Http';

const fetch = new Http();

export interface ILoginRequest {
  account: string;
  password: string;
  username: string;
}

export const login = (data: ILoginRequest, fn?: Function): Promise<IUser> =>
  fetch.post('/api/user/login', data, fn);
