export type Method = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export interface NordusConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  responseType?: "json" | "text" | "blob" | "arraybuffer" | "formData";
  body?: any;
}

export interface NordusConfigApi extends NordusConfig, Method {}

export interface NordusResponse<T = any> extends Response {
  data?: T;
}

export class NordusRequest {
  async request<T = any>(url: string, nordusConfigApi: NordusConfigApi) {
    const urlRequest = this.generateURL(url, nordusConfigApi);
    const body = this.getBody(nordusConfigApi);
    const request = new Request(urlRequest, {
      method: nordusConfigApi?.method,
      body: body,
    });

    this.setHeaders(nordusConfigApi, request);
    this.setRequestType(request, nordusConfigApi);

    const response = (await fetch(request)) as NordusResponse<T>;
    if (!response.ok) throw new Error(response.statusText);

    response.data = await this.getResponseFromType<T>(
      response,
      nordusConfigApi
    );
    return response;
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
        return (await response.formData()) as T;
      default:
        return undefined;
    }
  }
}
