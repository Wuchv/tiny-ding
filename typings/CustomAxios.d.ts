import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface CustomAxios {
  new (config?: AxiosRequestConfig): CustomAxios;
  getAxiosInstance(): AxiosInstance;
  cancel(msg: string): void;
  get(url: string, data: SafeObject, fn?: Function): Promise<any>;
  post(url: string, data: SafeObject, fn?: Function): Promise<any>;
  put(url: string, data: SafeObject, fn?: Function): Promise<any>;
}
