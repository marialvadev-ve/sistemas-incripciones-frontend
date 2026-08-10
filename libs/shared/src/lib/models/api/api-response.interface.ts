export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success?: boolean;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
