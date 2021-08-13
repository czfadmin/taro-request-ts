/**
 * 根据 https://github.com/TigerHee/taro-request 的内容修改
 *
 */

import Taro, { General, request } from "@tarojs/taro";
import getBaseUrl from "./base_url";
import { HttpRequestMethod } from "./methods";
import interceptors from "./interceptors";

interceptors.forEach((interceptorItem) => Taro.addInterceptor(interceptorItem));

export interface HttpRequestOption {
  contentType?: string;
  Authorization?: any;
  onSuccess?: (result: request.SuccessCallbackResult) => void;
  onFail?: (response: General.CallbackResult) => void;
  onCompleted?: (response: General.CallbackResult) => void;
}

export interface HttpRequestParams {
  baseUrl?: string;
  path: string;
  data?: any;
  method?: HttpRequestMethod;
  option?: HttpRequestOption;
}
class HttpRequest {
  #BASE_REQUEST_OPTION: HttpRequestOption = {
    contentType: "application/json",
    Authorization: Taro.getStorageSync("Authorization"),
  };
  static instance: HttpRequest | null = null;
  private constructor() {}

  static get Instance() {
    if (this.instance && this.instance !== null) {
      return this.instance;
    }
    this.instance = new HttpRequest();
    return this.instance;
  }
  private request(params: HttpRequestParams) {
    const { baseUrl, path, data, method, option } = params;
    let _baseUrl = baseUrl
      ? `${baseUrl}/${path}`
      : `${getBaseUrl(path)}/${path}`;

    let opt: null | request.Option = null;
    if (option) {
      opt = {
        url: _baseUrl,
        data: data,
        method: method,
        header: {
          "Content-Type": option.contentType,
          Authorization: option.Authorization,
        },
        success: option.onSuccess,
        fail: option.onFail,
        complete: option.onCompleted,
      };
    } else {
      opt = {
        url: _baseUrl,
        data: data,
        method: method,
        header: {
          "Content-Type": "application/json",
          Authorization: Taro.getStorageSync("Authorization"),
        },
      };
    }
    return Taro.request(opt);
  }

  get(path: string, data?: any, option?: HttpRequestOption) {
    return this.request({
      path: path,
      data: data,
      method: HttpRequestMethod.GET,
      option: option ? option : this.#BASE_REQUEST_OPTION,
    });
  }

  put(path: string, data?: any, option?: HttpRequestOption) {
    return this.request({
      path: path,
      data: data,
      method: HttpRequestMethod.GET,
      option: option ? option : this.#BASE_REQUEST_OPTION,
    });
  }
  delete(path: string, data?: any, option?: HttpRequestOption) {
    return this.request({
      path: path,
      data: data,
      method: HttpRequestMethod.DELETE,
      option: option ? option : this.#BASE_REQUEST_OPTION,
    });
  }
  post(path: string, data?: any, option?: HttpRequestOption) {
    return this.request({
      path: path,
      data: data,
      method: HttpRequestMethod.POST,
      option: option ? option : this.#BASE_REQUEST_OPTION,
    });
  }
}

export default HttpRequest.Instance;
