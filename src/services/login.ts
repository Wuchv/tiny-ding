import Http from '../modules/Http';

const fetch = new Http();

export interface ILoginRequest {
  phone_number: string;
  password: string;
}

export interface ILoginResponse {
  err: string;
  uid: string;
  nickname?: string;
  avatarUrl?: string;
}

export const login = (
  data: ILoginRequest,
  fn?: Function
): Promise<ILoginResponse> => fetch.get('/api/login', data, fn);
