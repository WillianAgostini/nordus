import { append } from "./utils";

export type Method = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export type InterceptorRequest = (err: Error, request: Request) => void;

export type InterceptorResponse = (
  err: Error,
  response: NordusResponse,
) => void;

interface Interceptors {
  request?: InterceptorRequest | InterceptorRequest[];
  response?: InterceptorResponse | InterceptorResponse[];
}

export interface NordusConfig extends RequestInit {
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  responseType?: "json" | "text" | "blob" | "arraybuffer" | "formData";
  body?: any;
  interceptors?: Interceptors;
  /**
   * @default undefined
   * Time in milliseconds to wait before aborting the request.
   * */
  timeout?: number;
}

interface InterceptorsApi {
  request: InterceptorRequest[];
  response: InterceptorResponse[];
}

export interface NordusConfigApi extends NordusConfig {
  interceptors: InterceptorsApi;
}

export interface NordusResponse<T = any> extends Response {
  data?: T;
}

type AbortTimeout = {
  signal?: AbortSignal;
  start: () => NodeJS.Timeout | undefined;
};

export class NordusRequest {
  readonly interceptorRequest: InterceptorRequest[] = [];
  readonly interceptorsResponse: InterceptorResponse[] = [];

  async request<T>(url: string, nordusConfigApi: NordusConfigApi) {
    if (nordusConfigApi.interceptors) {
      this.registerInterceptors(nordusConfigApi.interceptors);
    }

    const abort = this.createAbortTimeout(nordusConfigApi);
    const request = await this.prepareRequest(url, nordusConfigApi, abort);
    return await this.makeRequest<T>(request, nordusConfigApi, abort);
  }

  private createAbortTimeout(nordusConfigApi: NordusConfigApi): AbortTimeout {
    if (!nordusConfigApi.timeout) {
      return {
        signal: undefined,
        start: () => undefined,
      };
    }
    const controller = new AbortController();
    const start = () =>
      setTimeout(() => controller.abort(), nordusConfigApi.timeout);

    return {
      signal: controller.signal,
      start: start,
    };
  }

  registerInterceptors(interceptors: Interceptors) {
    if (interceptors.request)
      append(this.interceptorRequest, interceptors.request);
    if (interceptors.response)
      append(this.interceptorsResponse, interceptors.response);
  }

  private async prepareRequest(
    url: string,
    nordusConfigApi: NordusConfigApi,
    abort: AbortTimeout,
  ) {
    let error, request;
    try {
      const urlRequest = this.generateURL(url, nordusConfigApi);
      const body = this.getBody(nordusConfigApi);
      const init = {
        ...{
          method: nordusConfigApi?.method,
          body: body,
          signal: abort.signal,
        },
        ...nordusConfigApi,
      };

      request = new Request(urlRequest, init);

      this.setHeaders(nordusConfigApi, request);
      this.setRequestType(request, nordusConfigApi);
    } catch (err) {
      error = err;
    }

    await this.executeLoopAsync(this.interceptorRequest, error, request);
    if (error) throw error;
    return request!;
  }

  private async makeRequest<T>(
    request: Request,
    nordusConfigApi: NordusConfigApi,
    abort: AbortTimeout,
  ) {
    const timeoutId = abort.start();
    let error, response;
    try {
      response = (await fetch(request)) as NordusResponse<T>;
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(response.statusText);

      response.data = await this.getResponseFromType<T>(
        response,
        nordusConfigApi,
      );
    } catch (err) {
      error = err;
      clearTimeout(timeoutId);
    }

    await this.executeLoopAsync(this.interceptorsResponse, error, response);
    if (error) throw error;
    return response!;
  }

  private async executeLoopAsync(interceptors: any[], err: any, reason: any) {
    for (const interceptor of interceptors) {
      await interceptor(err, reason);
    }
  }

  private getBody(nordusConfig: NordusConfigApi) {
    switch (nordusConfig.responseType) {
      case "json":
        return JSON.stringify(nordusConfig.body);
      default:
        return nordusConfig.body;
    }
  }

  private setHeaders(nordusConfigApi: NordusConfigApi, request: Request) {
    if (nordusConfigApi.headers) {
      for (const [key, value] of Object.entries(nordusConfigApi.headers)) {
        request.headers.set(key, value);
      }
    }
  }

  private generateURL(url: string, nordusConfigApi: NordusConfigApi) {
    if (nordusConfigApi.baseURL)
      url = nordusConfigApi.baseURL + (url.startsWith("/") ? url : "/" + url);

    if (nordusConfigApi.params) {
      const params = new URLSearchParams(nordusConfigApi.params);
      url += "?" + params.toString();
    }

    return new URL(url);
  }

  private setRequestType(request: Request, nordusConfigApi: NordusConfigApi) {
    if (request.headers.has("Content-Type")) return;

    switch (nordusConfigApi.responseType) {
      case "json":
        return request.headers.set("Content-Type", "application/json");
      case "text":
        return request.headers.set("Content-Type", "text/plain");
      case "blob":
        return request.headers.set("Content-Type", "application/octet-stream");
      case "arraybuffer":
        return request.headers.set("Content-Type", "application/octet-stream");
      case "formData":
        return request.headers.set("Content-Type", "multipart/form-data");
    }
  }

  private async getResponseFromType<T>(
    response: Response,
    nordusConfigApi: NordusConfigApi,
  ) {
    switch (nordusConfigApi.responseType) {
      case "json":
        return (await response.json()) as T;
      case "text":
        return (await response.text()) as T;
      case "blob":
        return (await response.blob()) as T;
      case "arraybuffer":
        return (await response.arrayBuffer()) as T;
      case "formData":
        return (await response.text()) as T;
      default:
        return undefined;
    }
  }
}
