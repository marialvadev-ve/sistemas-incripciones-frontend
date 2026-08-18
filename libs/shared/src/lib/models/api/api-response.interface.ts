export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  isSuccess?: boolean;
}

export interface ApiErrorResponse {
  isSuccess?: boolean;
  statusCode?: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
  errors?: {
    detalle?: string[];
  };
}
