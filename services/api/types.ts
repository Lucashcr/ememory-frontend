export type ApiErrorResponse = {
  detail?: string;
  code?: string;
  errors?: Record<string, string[]>;
  message?: string;
}

export type ApiSuccessResponse<T> = {
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export enum ApiErrorCode {
  BAD_REQUEST = 'bad_request',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  VALIDATION_ERROR = 'validation_error',
  INTERNAL_SERVER_ERROR = 'internal_server_error',
}
