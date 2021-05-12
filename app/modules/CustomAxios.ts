import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';
import { delay } from 'lodash';
import { getUserManager } from '.';
import { host, port } from '../constants';
import { createWindow, WindowName } from '../browser-window';
import { messageBox } from '../dialog';

const FormData = require('form-data');

export const DEFAULT_HEADER = 'application/x-www-form-urlencoded';
export const FILE_HEADER = 'multipart/form-data';

const baseAxiosConfig: AxiosRequestConfig = {
  headers: { 'Content-Type': DEFAULT_HEADER },
  timeout: 1000 * 10,
  // 可携带cookies
  withCredentials: true,
  baseURL: `http://${host}:${port}`,
};

export default class CustomAxios {
  private axiosRequestConfig: AxiosRequestConfig;
  private axiosInstance: AxiosInstance;
  private source: CancelTokenSource;

  constructor(config?: AxiosRequestConfig) {
    this.source = axios.CancelToken.source();
    this.axiosRequestConfig = {
      ...baseAxiosConfig,
      ...config,
      cancelToken: this.source.token,
    };
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

  public cancel(msg: string) {
    this.source.cancel(msg);
  }

  //请求拦截器
  private setRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(async (config) => {
      const self: IUser = await getUserManager().getOwnInfo();
      if (self) {
        config.headers['Authorization'] = `Bearer ${self.access_token}`;
      }
      return config;
    });
  }

  //响应拦截器
  private setResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>): any =>
        response.status === 200
          ? Promise.resolve(response.data || response.headers)
          : Promise.reject(response.data || response.headers),
      (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401: //Unauthorized
              if (!window.location.hash.includes('login')) {
                delay(() => createWindow(WindowName.LOGIN_REGISTER), 2000);
              }
              break;
            //处理返回码
            default:
              break;
          }
        }
        //断网处理
        // if (!window.navigator.onLine) {
        //   // message.error('网络出现波动');
        //   console.red('网络出现波动');
        // }
        //axios cancel 后取 error.message
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }

  private transformRequestData(data: any) {
    let ret: string | FormData = '';
    if (data instanceof FormData) {
      ret = data;
    } else {
      for (let it in data) {
        ret +=
          encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
      }
    }
    return ret;
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
        console.red(error);
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
        transformRequest: [this.transformRequestData],
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
          console.red(error);
          return error;
        }
      );
  }

  public put(url: string, data: SafeObject, fn?: Function): Promise<any> {
    return this.axiosInstance
      .put(url, data, {
        transformRequest: [this.transformRequestData],
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
          return error;
        }
      );
  }
}
