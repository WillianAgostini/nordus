import {
  NordusInterceptorManager,
  createInterceptors,
  requestInterptorsManager,
  responseInterceptorsManager,
} from "./interceptors";
import {
  InterceptorRequest,
  InterceptorResponse,
  NordusConfig,
  NordusConfigApi,
  NordusRequest,
  NordusResponse,
} from "./request";
import { append } from "./utils";

export async function get<T = any>(url: string, nordusConfig?: NordusConfig) {
  const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

  nordusConfigApi.method = "GET";
  return await nordusRequest.request<T>(url, nordusConfigApi);
}

export async function post<T = any, D = any>(
  url: string,
  body: D,
  nordusConfig?: NordusConfig,
) {
  const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

  nordusConfigApi.method = "POST";
  nordusConfigApi.body = body;
  return await nordusRequest.request<T>(url, nordusConfigApi);
}

export async function put<T = any, D = any>(
  url: string,
  body: D,
  nordusConfig?: NordusConfig,
) {
  const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

  nordusConfigApi.method = "POST";
  nordusConfigApi.body = body;
  return await nordusRequest.request<T>(url, nordusConfigApi);
}

export async function patch<T = any, D = any>(
  url: string,
  body: D,
  nordusConfig?: NordusConfig,
) {
  const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

  nordusConfigApi.method = "PATCH";
  nordusConfigApi.body = body;
  return await nordusRequest.request<T>(url, nordusConfigApi);
}

export async function del<T = any>(url: string, nordusConfig?: NordusConfig) {
  const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

  nordusConfigApi.method = "DELETE";
  return await nordusRequest.request<T>(url, nordusConfigApi);
}

function createRequest(nordusConfig?: NordusConfig) {
  const nordusRequest = new NordusRequest();
  const nordusConfigApi = getDefaultConfig(nordusConfig);
  return { nordusRequest, nordusConfigApi };
}

export async function request<T>(url: string, nordusConfig: NordusConfig) {
  const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);
  return await nordusRequest.request<T>(url, nordusConfigApi);
}

function mergeConfig(
  nordusConfig?: NordusConfig,
  nordusConfig2?: NordusConfig,
): NordusConfig {
  const interceptorsRequest: InterceptorRequest[] = [];
  if (nordusConfig?.interceptors?.request)
    append(interceptorsRequest, nordusConfig.interceptors.request);
  if (nordusConfig2?.interceptors?.request)
    append(interceptorsRequest, nordusConfig2.interceptors.request);

  const interceptorsResponse: InterceptorResponse[] = [];
  if (nordusConfig?.interceptors?.response)
    append(interceptorsResponse, nordusConfig.interceptors.response);
  if (nordusConfig2?.interceptors?.response)
    append(interceptorsResponse, nordusConfig2.interceptors.response);

  return {
    ...nordusConfig,
    ...nordusConfig2,
    interceptors: {
      request: interceptorsRequest,
      response: interceptorsResponse,
    },
  };
}

interface Nordus {
  interceptors: {
    request: NordusInterceptorManager<InterceptorRequest>;
    response: NordusInterceptorManager<InterceptorResponse>;
  };
  get: <T = any>(
    url: string,
    nordusConfig?: NordusConfig,
  ) => Promise<NordusResponse<T>>;
  post: <T = any, D = any>(
    url: string,
    body: D,
    nordusConfig?: NordusConfig,
  ) => Promise<NordusResponse<T>>;
  put: <T = any, D = any>(
    url: string,
    body: D,
    nordusConfig?: NordusConfig,
  ) => Promise<NordusResponse<T>>;
  patch: <T = any, D = any>(
    url: string,
    body: D,
    nordusConfig?: NordusConfig,
  ) => Promise<NordusResponse<T>>;
  del: <T = any>(
    url: string,
    nordusConfig?: NordusConfig,
  ) => Promise<NordusResponse<T>>;
}

export function create(nordusConfig?: NordusConfig) {
  const nordusConfigApi = getDefaultConfig(nordusConfig);
  return {
    get: <T = any>(url: string, nordusConfig?: NordusConfig) =>
      get<T>(url, mergeConfig(nordusConfigApi, nordusConfig)),
    post: <T = any, D = any>(
      url: string,
      body: D,
      nordusConfig?: NordusConfig,
    ) => post<T, D>(url, body, mergeConfig(nordusConfigApi, nordusConfig)),
    put: <T = any, D = any>(
      url: string,
      body: D,
      nordusConfig?: NordusConfig,
    ) => put<T, D>(url, body, mergeConfig(nordusConfigApi, nordusConfig)),
    patch: <T = any, D = any>(
      url: string,
      body: D,
      nordusConfig?: NordusConfig,
    ) => patch<T, D>(url, body, mergeConfig(nordusConfigApi, nordusConfig)),
    del: <T = any>(url: string, nordusConfig?: NordusConfig) =>
      del<T>(url, mergeConfig(nordusConfigApi, nordusConfig)),
    interceptors: {
      request: requestInterptorsManager(nordusConfigApi),
      response: responseInterceptorsManager(nordusConfigApi),
    },
  } as Nordus;
}

function getDefaultConfig(nordusConfig?: NordusConfig) {
  if (!nordusConfig) nordusConfig = {};

  if (!nordusConfig.responseType) nordusConfig.responseType = "json";

  createInterceptors(nordusConfig);

  return nordusConfig as NordusConfigApi;
}
