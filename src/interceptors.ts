import {
  InterceptorRequest,
  InterceptorResponse,
  NordusConfig,
  NordusConfigApi,
} from "./request";
import { asArray, randomUUID, getValueByKey } from "./utils";

export interface NordusInterceptorManager<V> {
  use(interceptor: V): string;
  eject(id: string): void;
  clear(): void;
}

export function requestInterptorsManager(
  nordusConfigApi: NordusConfigApi,
): NordusInterceptorManager<InterceptorRequest> {
  return {
    use: (interceptor: InterceptorRequest) => {
      return addInterceptor(nordusConfigApi.interceptors.request, interceptor);
    },
    eject: (id: string) => {
      nordusConfigApi.interceptors.request = removeInterceptor(
        nordusConfigApi.interceptors.request,
        id,
      );
    },
    clear: () => {
      nordusConfigApi.interceptors.request = [];
    },
  };
}

export function responseInterceptorsManager(
  nordusConfigApi: NordusConfigApi,
): NordusInterceptorManager<InterceptorResponse> {
  return {
    use: (interceptor: InterceptorResponse) => {
      return addInterceptor(nordusConfigApi.interceptors.response, interceptor);
    },
    eject: (id: string) => {
      nordusConfigApi.interceptors.response = removeInterceptor(
        nordusConfigApi.interceptors.response,
        id,
      );
    },
    clear: () => {
      nordusConfigApi.interceptors.response = [];
    },
  };
}

export function createInterceptors(nordusConfig: NordusConfig) {
  const interceptorsRequest = asArray(nordusConfig.interceptors?.request);
  const interceptorsResponse = asArray(nordusConfig.interceptors?.response);
  if (!nordusConfig.interceptors)
    nordusConfig.interceptors = {
      request: interceptorsRequest,
      response: interceptorsResponse,
    };
}

export function addInterceptor<T>(list: T[], interceptor: T) {
  list.push(interceptor);
  const uuid = randomUUID();
  Object.defineProperty(interceptor, "__interceptorId", {
    value: uuid,
  });
  return uuid;
}

export function removeInterceptor<T>(interceptor: T[], id: string) {
  return interceptor.filter((element) => {
    return getValueByKey("__interceptorId", element) != id;
  });
}
