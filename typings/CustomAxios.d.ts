import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface CustomAxios {
  new (config?: AxiosRequestConfig): CustomAxios;
  getAxiosInstance(): AxiosInstance;
  cancel(msg: string): void;
  get(url: string, data: object, fn?: Function): Promise<any>;
  post(url: string, data: object, fn?: Function): Promise<any>;
}
