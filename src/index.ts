import { NordusConfig, NordusConfigApi, NordusRequest } from "./request";

export async function get<T = any>(url: string, nordusConfig?: NordusConfig) {
    const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

    nordusConfigApi.method = 'GET';
    return await nordusRequest.request<T>(url, nordusConfigApi);
}

export async function post<T = any, D = any>(url: string, body: D, nordusConfig?: NordusConfig) {
    const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

    nordusConfigApi.method = 'POST';
    nordusConfigApi.body = body;
    return await nordusRequest.request<T>(url, nordusConfigApi);
}

export async function put<T = any, D = any>(url: string, body: D, nordusConfig?: NordusConfig) {
    const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

    nordusConfigApi.method = 'POST';
    nordusConfigApi.body = body;
    return await nordusRequest.request<T>(url, nordusConfigApi);
}

export async function patch<T = any, D = any>(url: string, body: D, nordusConfig?: NordusConfig) {
    const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

    nordusConfigApi.method = 'PATCH';
    nordusConfigApi.body = body;
    return await nordusRequest.request<T>(url, nordusConfigApi);
}

export async function del<T = any>(url: string, nordusConfig?: NordusConfig) {
    const { nordusRequest, nordusConfigApi } = createRequest(nordusConfig);

    nordusConfigApi.method = 'DELETE';
    return await nordusRequest.request<T>(url, nordusConfigApi);
}

function createRequest(nordusConfig?: NordusConfig) {
    const nordusRequest = new NordusRequest();
    const nordusConfigApi = getDefaultConfig(nordusConfig);
    return { nordusRequest, nordusConfigApi };
}

function getDefaultConfig(nordusConfig?: NordusConfig) {
    if (!nordusConfig)
        nordusConfig = {};

    if (!nordusConfig.responseType)
        nordusConfig.responseType = 'json';

    return nordusConfig as NordusConfigApi;
}

