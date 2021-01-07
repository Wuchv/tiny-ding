import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

const DEFAULT_HEADER = 'application/x-www-form-urlencoded';
const FILE_HEADER = 'multipart/form-data';

const baseAxiosConfig: AxiosRequestConfig = {
  headers: { 'Content-Type': DEFAULT_HEADER },
  timeout: 1000 * 10,
  // 可携带cookies
  withCredentials: true,
  baseURL: '',
};

export default class Http {
  private axiosRequestConfig: AxiosRequestConfig;
  private axiosInstance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.axiosRequestConfig = { ...baseAxiosConfig, ...config };
    this.createAxiosInstance();
  }

  private createAxiosInstance(): void {
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create(this.axiosRequestConfig);
      this.setRequestInterceptor();
      this.setResponseInterceptor();
    }
  }

  public getAxiosInstance(): AxiosInstance {
    if (!this.axiosInstance) {
      this.createAxiosInstance();
    }
    return this.axiosInstance;
  }

  //请求拦截器
  private setRequestInterceptor() {
    this.axiosInstance.interceptors.request.use((config) => {
      console.log('loading');
      return config;
    });
  }

  //响应拦截器
  private setResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>) =>
        response.data.code === 200
          ? Promise.resolve(response.data)
          : Promise.reject(response.data),
      (error) => {
        if (error.response) {
          switch (error.response.status) {
            //处理返回码
            default:
              break;
          }
          return Promise.reject(error.response);
        }
        if (!window.navigator.onLine) {
          //断网处理
        }
        return Promise.reject(error);
      }
    );
  }
}
