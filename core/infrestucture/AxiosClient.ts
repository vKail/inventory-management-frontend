import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { getToken } from "../utils/TokenUtils";
import { toast } from "sonner";
import { HTTP_STATUS_CODE } from "../data/HttpStatus";

export class AxiosClient {
    private static instance: AxiosClient
    private axiosInstance: AxiosInstance

    private constructor() {
        this.axiosInstance = axios.create(
            {
                baseURL: process.env.NEXT_PUBLIC_API_URL,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token.replaceAll('"', '')}`;
                } else {
                    document.dispatchEvent(new CustomEvent("unauthorized"));
                }
                return config;

            }
        )
        this.axiosInstance.interceptors.response.use(
            (response) => {
                if (!["get"].includes(response.config.method || ""))
                    toast.success("Acción realizada con éxito", {
                        duration: 2000,
                        position: "top-right",
                        style: {
                            background: "#4caf50",
                            color: "#fff",
                        },
                    });
                return response;
            },
            (error) => {
                if (error.response){
                const errors = error.response.data.status.message || "Error desconocido"
                toast.error(errors, {
                    duration: 2000,
                    position: "top-right",
                    style: {
                        background: "#f44336",
                        color: "#fff",
                    },
                });
            }
            if (error.response.status === HTTP_STATUS_CODE.FORBIDDEN) {
                if(typeof window !== "undefined"){
                    window.location.href = "/dashboard";
                }
            }
            return Promise.reject(error);
            }
        )
    }

    public static getInstance(): AxiosClient {
        if (!AxiosClient.instance) {
            AxiosClient.instance = new AxiosClient();
        }
        return AxiosClient.instance;
    } 

    public async get<T>(url: string, config: AxiosRequestConfig): Promise<T> {
            const promise = this.axiosInstance.get<T>(url, config);
            const response : AxiosResponse<T> = await promise;
            return response.data;
    }

    public async post<T>(url: string, data: any, config: AxiosRequestConfig): Promise<T> {
        const promise = this.axiosInstance.post<T>(url, data, config);
        const response : AxiosResponse<T> = await promise;
        return response.data;
    }

    public async put<T>(url: string, data: any, config: AxiosRequestConfig): Promise<T> {
        const promise = this.axiosInstance.put<T>(url, data, config);
        const response : AxiosResponse<T> = await promise;
        return response.data;
    }

    public async delete<T>(url: string, config: AxiosRequestConfig): Promise<T> {
        const promise = this.axiosInstance.delete<T>(url, config);
        const response : AxiosResponse<T> = await promise;
        return response.data;
    }

    public async patch<T>(url: string, data: any, config: AxiosRequestConfig): Promise<T> {
        const promise = this.axiosInstance.patch<T>(url, data, config);
        const response : AxiosResponse<T> = await promise;
        return response.data;
    }
}