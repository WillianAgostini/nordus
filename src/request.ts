
export type Method = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export interface NordusConfig {
    headers?: Record<string, string>;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'formData';
    body?: any;
};

export interface NordusConfigApi extends NordusConfig, Method { }

export interface NordusResponse<T = any> extends Response {
    data: T;
}

export class NordusRequest {

    async request<T = any>(url: string, nordusConfig: NordusConfigApi) {
        const urlRequest = this.generateURL(url);
        const body = this.getBody(nordusConfig);
        const request = new Request(urlRequest, {
            method: nordusConfig?.method,
            body: body
        });
        this.setHeaders(nordusConfig, request);

        this.setRequestType(request, nordusConfig);

        if (nordusConfig?.body) {
            request
        }

        const response = await fetch(request) as NordusResponse<T>;
        if(!response.ok)
            throw new Error(response.statusText);
                    
        response.data = await this.getResponseFromType<T>(response, nordusConfig);
        return response;
    }

    private getBody(nordusConfig: NordusConfigApi) {
        if (!nordusConfig?.body)
            return;

        switch (nordusConfig.responseType) {
            case 'json':
                return JSON.stringify(nordusConfig.body);
            case 'text':
                return nordusConfig.body.toString();
            case 'blob':
                return nordusConfig.body;
            case 'arraybuffer':
                return nordusConfig.body;
            case 'formData':
                return nordusConfig.body;
        }
    }

    private setHeaders(nordusConfig: NordusConfig, request: Request) {
        if (nordusConfig?.headers) {
            for (const [key, value] of Object.entries(nordusConfig.headers)) {
                request.headers.set(key, value);
            }
        }
    }

    private generateURL(url: string) {
        return new URL(url)
    }

    private setRequestType(request: Request, nordusConfig: NordusConfig) {
        switch (nordusConfig.responseType) {
            case 'json':
                return request.headers.set('Content-Type', 'application/json');
            case 'text':
                return request.headers.set('Content-Type', 'text/plain');
            case 'blob':
                return request.headers.set('Content-Type', 'application/octet-stream');
            case 'arraybuffer':
                return request.headers.set('Content-Type', 'application/octet-stream');
            case 'formData':
                return request.headers.set('Content-Type', 'multipart/form-data');
            default:
                throw new Error('Unknown response type: ' + nordusConfig.responseType);
        }
    }

    private async getResponseFromType<T = any>(response: Response, nordusConfig: NordusConfig) {
        switch (nordusConfig.responseType) {
            case 'json': return await response.json() as T;
            case 'text': return await response.text() as T;
            case 'blob': return await response.blob() as T;
            case 'arraybuffer': return await response.arrayBuffer() as T;
            case 'formData': return await response.formData() as T;
        }

        throw new Error('Unknown response type: ' + nordusConfig.responseType);
    }

}
