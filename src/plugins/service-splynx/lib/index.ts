/**
 * Splynx Node.js API v. 1.0.6
 * Splynx REST API Class
 * Author: Ruslan Malymon (Splynx s.r.o.), Tsumanchuk Volodymyr
 * http://docs.splynx.apiary.io/ - documentation
 */

import { SplynxApi } from "./api";
const http_build_query = require("qhttp/http_build_query");

export class ApiHelper {
  api: any;
  constructor(host: any, api_key?: any, api_secret?: any) {
    this.api = new SplynxApi(host, api_key, api_secret);
    this.api.version = SplynxApi.API_VERSION_1_0;
  }

  static get API_VERSION_1_0() {
    return SplynxApi.API_VERSION_1_0;
  }

  static get API_VERSION_2_0() {
    return SplynxApi.API_VERSION_2_0;
  }

  static get LOGIN_TYPE_ADMIN() {
    return SplynxApi.LOGIN_TYPE_ADMIN;
  }

  static get LOGIN_TYPE_CUSTOMER() {
    return SplynxApi.LOGIN_TYPE_CUSTOMER;
  }

  static get LOGIN_TYPE_API_KEY() {
    return SplynxApi.LOGIN_TYPE_API_KEY;
  }

  static get LOGIN_TYPE_SESSION() {
    return SplynxApi.LOGIN_TYPE_SESSION;
  }

  static get CONTENT_TYPE_APPLICATION_JSON() {
    return SplynxApi.CONTENT_TYPE_APPLICATION_JSON;
  }

  static get CONTENT_TYPE_MULTIPART_FORM_DATA() {
    return SplynxApi.CONTENT_TYPE_MULTIPART_FORM_DATA;
  }

  set sash(value: any) {
    this.api.sash = value;
  }

  get administrator() {
    return this.api.administrator;
  }

  set debug(value: any) {
    this.api.debug = value;
  }

  set version(value) {
    this.api.version = value;
  }

  get version() {
    return this.api.version;
  }

  /**
   * Set event handler.
   * Allowed events: `unauthorized`, `renew_token`.
   * @param {string} event
   * @param {callback} callback
   */
  on(event?: any, callback?: any) {
    if (typeof this.api["on_" + event + "_callback"] !== "undefined") {
      this.api["on_" + event + "_callback"] = callback;
    }
  }

  get<T>(url?: any, id?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      let options = {
        method: "GET",
        path: url,
      };

      if (typeof id !== "undefined") {
        options.path += "/" + id;
      }

      this.api.process(options, (res?: any) => {
        if (res.statusCode == 200) {
          resolve(res.response);
        } else {
          reject(res);
        }
      });
    });
  }

  post<TP, TR>(url?: any, params?: TP, contentType?: string): Promise<TR> {
    return new Promise((resolve, reject) => {
      let options = {
        method: "POST",
        contentType: contentType,
        path: url,
        params: params,
      };

      this.api.process(options, (res?: any) => {
        if (res.statusCode == 201) {
          resolve(res.response);
        } else {
          reject(res);
        }
      });
    });
  }

  put(url?: any, id?: any, params?: any) {
    return new Promise((resolve, reject) => {
      let options = {
        method: "PUT",
        contentType: "application/json",
        path: url + "/" + id,
        params: params,
      };

      this.api.process(options, (res?: any) => {
        if (res.statusCode == 202) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  custom(
    url?: any,
    method?: any,
    params?: any,
    statusCode?: any,
    contentType?: any
  ) {
    return new Promise((resolve, reject) => {
      let options = {
        method: method,
        contentType: contentType || "application/json",
        path: url,
        params: params,
      };

      this.api.process(options, (res?: any) => {
        if (res.statusCode == (statusCode || 202)) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  del(url?: any, id?: any) {
    return new Promise((resolve, reject) => {
      let options = {
        method: "DELETE",
        path: url + "/" + id,
      };

      this.api.process(options, (res?: any) => {
        if (res.statusCode == 204) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  search(url?: any, params?: any) {
    return new Promise((resolve, reject) => {
      let options = {
        method: "GET",
        path: url + "?" + http_build_query(params),
      };

      this.api.process(options, (res?: any) => {
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  options(url?: any) {
    return new Promise((resolve, reject) => {
      let options = {
        method: "OPTIONS",
        path: url,
      };

      this.api.process(options, (res?: any) => {
        if (this.debug) {
          console.log("options response", res);
        }

        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  count(url?: any, params?: any) {
    return new Promise((resolve, reject) => {
      let path = url;
      if (typeof params !== "undefined") {
        path += "?" + http_build_query(params);
      }

      let options = {
        method: "HEAD",
        path: path,
      };

      this.api.process(options, (result?: any, response?: any) => {
        if (
          result.statusCode == 204 &&
          SplynxApi.HEADER_X_TOTAL_COUNT in response.headers
        ) {
          resolve(response.headers[SplynxApi.HEADER_X_TOTAL_COUNT]);
        } else {
          reject(result);
        }
      });
    });
  }

  login(auth_type?: any, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Prevent using login in API v1
      if (this.api.version === SplynxApi.API_VERSION_1_0) {
        reject(
          "Method `login` not allowed in API 1.0! See examples for more information."
        );
        return;
      }

      data["auth_type"] = auth_type;
      this.api
        .login(data)
        .then((res?: any) => {
          resolve(res);
        })
        .catch((err?: any) => {
          reject(err);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.api
        .logout()
        .then((res?: any) => {
          resolve(res);
        })
        .catch((err?: any) => {
          reject(err);
        });
    });
  }

  getAuthData() {
    return this.api.getAuthData();
  }

  setAuthData(auth_data?: any) {
    this.api.setAuthData(auth_data);
  }
}

export interface SplynxWebhook {
  type: string;
  data: SplynxWebhookData;
}

export interface SplynxWebhookData {
  source: string;
  model: string;
  action: string;
  date: string;
  time: string;
  administrator_id: string;
  customer_id: string;
  result: string;
  attributes: { [key: string]: string };
  attributes_additional: any[];
  changed_attributes: any[];
  extra: string;
  errors: string;
  ip: string;
  hook_id: string;
}
