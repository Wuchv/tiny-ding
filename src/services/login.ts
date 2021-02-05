import Http from '../modules/Http';

const fetch = new Http();

export interface ILoginRequest {
  phone_number: string;
  password: string;
}

export interface ILoginResponse {
  uid?: string;
  err?: string;
}

export const login = (
  data: ILoginRequest,
  fn?: Function
): Promise<ILoginResponse> => fetch.get('/api/login', data, fn);
