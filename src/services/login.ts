import Http from '../modules/Http';

const fetch = new Http();

export interface ILoginRequest {
  account: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
}

export const login = (
  data: ILoginRequest,
  fn: Function
): Promise<ILoginResponse> => fetch.get('/api/login', data, fn);
