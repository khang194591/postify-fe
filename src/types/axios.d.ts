// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosResponse } from "axios";

interface IResponse<T> {
  config: InternalAxiosRequestConfig;
  data: T;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  request?: unknown;
  status: number;
  statusText: string;
  // Thuộc tính custom
  success?: boolean;
  message?: string;
}

declare module "axios" {
  export interface AxiosResponse<T = unknown> extends Promise<IResponse<T>> {}
}
