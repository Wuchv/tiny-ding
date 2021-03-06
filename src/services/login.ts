import Http from '../modules/Http';

const fetch = new Http();

export interface ILoginRequest {
  phone_number: string;
  password: string;
}

export interface ILoginResponse {
  uid: string;
  nickname?: string;
  avatarUrl?: string;
}

export const login = (
  data: ILoginRequest,
  fn?: Function
): Promise<IResponse<ILoginResponse>> => fetch.get('/api/user/login', data, fn);
