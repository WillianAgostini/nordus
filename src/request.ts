export type Method = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

interface Interceptors {
  request?: (err: Error, request: Request) => void;
  response?: (err: Error, response: NordusResponse) => void;
}

export interface NordusConfig {
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

export interface NordusConfigApi extends NordusConfig, Method {}

export interface NordusResponse<T = any> extends Response {
  data?: T;
}

type AbortTimeout = {
  signal?: AbortSignal;
  start: () => NodeJS.Timeout | undefined;
};

export class NordusRequest {
  readonly requestInterceptors: any[] = [];
  readonly responseInterceptors: any[] = [];

  async request<T = any>(url: string, nordusConfigApi: NordusConfigApi) {
    if (nordusConfigApi.interceptors) {
      this.registerInterceptors(nordusConfigApi.interceptors);
    }

    const abort = this.createAbortTimeout(nordusConfigApi);
    const request = this.prepareRequest(url, nordusConfigApi, abort);
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
      this.requestInterceptors.push(interceptors.request);
    if (interceptors.response)
      this.responseInterceptors.push(interceptors.response);
  }

  private prepareRequest(
    url: string,
    nordusConfigApi: NordusConfigApi,
    abort: AbortTimeout
  ) {
    try {
      const urlRequest = this.generateURL(url, nordusConfigApi);
      const body = this.getBody(nordusConfigApi);
      const request = new Request(urlRequest, {
        method: nordusConfigApi?.method,
        body: body,
        signal: abort.signal,
      });

      this.setHeaders(nordusConfigApi, request);
      this.setRequestType(request, nordusConfigApi);
      this.requestInterceptors.forEach((interceptor) =>
        interceptor(null, request)
      );
      return request;
    } catch (error) {
      this.requestInterceptors.forEach((interceptor) =>
        interceptor(error, null)
      );
      throw error;
    }
  }

  private async makeRequest<T = any>(
    request: Request,
    nordusConfigApi: NordusConfigApi,
    abort: AbortTimeout
  ) {
    const timeoutId = abort.start();
    try {
      const response = (await fetch(request)) as NordusResponse<T>;
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(response.statusText);

      response.data = await this.getResponseFromType<T>(
        response,
        nordusConfigApi
      );
      this.responseInterceptors.forEach((interceptor) =>
        interceptor(null, response)
      );
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      this.responseInterceptors.forEach((interceptor) => interceptor(error));
      throw error;
    }
  }

  private getBody(nordusConfig: NordusConfigApi) {
    if (!nordusConfig?.body) return;

    switch (nordusConfig.responseType) {
      case "json":
        return JSON.stringify(nordusConfig.body);
      case "text":
        return nordusConfig.body.toString();
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

  private async getResponseFromType<T = any>(
    response: Response,
    nordusConfigApi: NordusConfigApi
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
