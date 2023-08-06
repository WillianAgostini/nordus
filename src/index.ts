import {
  InterceptorRequest,
  InterceptorResponse,
  NordusConfig,
  NordusConfigApi,
  NordusRequest,
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

export function create(nordusConf?: NordusConfig) {
  return {
    get: <T = any>(url: string, nordusConfig?: NordusConfig) =>
      get<T>(url, mergeConfig(nordusConf, nordusConfig)),
    post: <T = any, D = any>(
      url: string,
      body: D,
      nordusConfig?: NordusConfig,
    ) => post<T, D>(url, body, mergeConfig(nordusConf, nordusConfig)),
    put: <T = any, D = any>(
      url: string,
      body: D,
      nordusConfig?: NordusConfig,
    ) => put<T, D>(url, body, mergeConfig(nordusConf, nordusConfig)),
    patch: <T = any, D = any>(
      url: string,
      body: D,
      nordusConfig?: NordusConfig,
    ) => patch<T, D>(url, body, mergeConfig(nordusConf, nordusConfig)),
    del: <T = any>(url: string, nordusConfig?: NordusConfig) =>
      del<T>(url, mergeConfig(nordusConf, nordusConfig)),
  };
}

function getDefaultConfig(nordusConfig?: NordusConfig) {
  if (!nordusConfig) nordusConfig = {};

  if (!nordusConfig.responseType) nordusConfig.responseType = "json";

  return nordusConfig as NordusConfigApi;
}
