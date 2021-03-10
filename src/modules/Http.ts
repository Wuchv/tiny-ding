import { openLoginWindow } from '@src/utils';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { delay } from 'lodash';
import UserManager from './dbManager/UserManager';

const DEFAULT_HEADER = 'application/x-www-form-urlencoded';
const FILE_HEADER = 'multipart/form-data';

const baseAxiosConfig: AxiosRequestConfig = {
  headers: { 'Content-Type': DEFAULT_HEADER },
  timeout: 1000 * 10,
  // 可携带cookies
  withCredentials: true,
  baseURL: 'http://127.0.0.1:7000',
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
    this.axiosInstance.interceptors.request.use(async (config) => {
      const self: IUser = await UserManager.getOwnInfo();
      if (self) {
        config.headers['Authorization'] = `Bearer ${self.access_token}`;
      }
      return config;
    });
  }

  //响应拦截器
  private setResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>): any => {
        console.log(response);
        return response.status === 200
          ? Promise.resolve(response.data)
          : Promise.reject(response.data);
      },
      (error) => {
        console.log(error.response.data);
        if (error.response) {
          switch (error.response.status) {
            case 401: //Unauthorized
              message.error(error.response.data.message);
              if (!location.hash.includes('login')) {
                delay(openLoginWindow, 2000);
              }
              break;
            //处理返回码
            default:
              break;
          }
          return Promise.reject(error.response.data);
        }
        if (!window.navigator.onLine) {
          return Promise.reject({ statusCode: 400, message: '网络出现波动' });
          //断网处理
        }
        return Promise.reject({ statusCode: 500, message: String(error) });
      }
    );
  }

  /**
   * 发送get请求
   * @param url
   * @param data
   * @param fn
   */
  public get(url: string, data: object, fn?: Function): Promise<any> {
    return this.axiosInstance.get(url, { params: data }).then(
      (response) => {
        if (fn) {
          return fn(response);
        } else {
          return response;
        }
      },
      (error) => {
        console.error(error);
        return error;
      }
    );
  }

  /**
   * 发送post请求
   * @param url
   * @param data
   * @param fn
   */
  public post(url: string, data: object, fn?: Function): Promise<any> {
    return this.axiosInstance
      .post(url, data, {
        transformRequest: [
          (data) => {
            let ret = '';
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                '=' +
                encodeURIComponent(data[it]) +
                '&';
            }
            return ret;
          },
        ],
        withCredentials: true,
      })
      .then(
        (response) => {
          if (fn) {
            return fn(response);
          } else {
            return response;
          }
        },
        (error) => {
          console.error(error);
          return error;
        }
      );
  }
}
