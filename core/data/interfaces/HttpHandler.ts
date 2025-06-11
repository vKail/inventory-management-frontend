export interface HttpHandler {
    get<T>(url: string, config?: any): Promise<IHttpResponse<T>>
    post<T>(url: string, data?: any, config?: any): Promise<IHttpResponse<T>>
    put<T>(url: string, data?: any, config?: any): Promise<IHttpResponse<T>>
    delete<T>(url: string, config?: any): Promise<IHttpResponse<T>>
    patch<T>(url: string, data?: any, config?: any): Promise<IHttpResponse<T>>
}

export interface IHttpResponse<T> {
  success: boolean
  message: IHttpMessage
  data: T
  statusCode: number
  metadata: any
}

interface IHttpMessage {
    content: string[],
    dispayable: boolean,
}
