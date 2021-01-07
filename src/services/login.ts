import Http from '../modules/Http';

const fetch = new Http();

export const login = (): Promise<any> =>
  fetch.getAxiosInstance().get('api/login');
