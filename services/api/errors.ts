import { AxiosError } from 'axios';
import { ApiErrorCode, ApiErrorResponse } from './types';

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly errors?: Record<string, string[]>;
  public readonly statusCode: number;

  constructor(error: AxiosError<ApiErrorResponse>) {
    const errorResponse = error.response?.data;
    const message = errorResponse?.detail || errorResponse?.message || error.message;
    
    super(message);
    
    this.name = 'ApiError';
    this.statusCode = error.response?.status || 500;
    this.errors = errorResponse?.errors;
    
    // Map HTTP status codes to error codes
    switch (this.statusCode) {
      case 400:
        this.code = ApiErrorCode.BAD_REQUEST;
        break;
      case 401:
        this.code = ApiErrorCode.UNAUTHORIZED;
        break;
      case 403:
        this.code = ApiErrorCode.FORBIDDEN;
        break;
      case 404:
        this.code = ApiErrorCode.NOT_FOUND;
        break;
      case 422:
        this.code = ApiErrorCode.VALIDATION_ERROR;
        break;
      default:
        this.code = ApiErrorCode.INTERNAL_SERVER_ERROR;
    }
  }

  public getFirstError(): string | undefined {
    if (!this.errors) return undefined;
    
    const firstField = Object.keys(this.errors)[0];
    if (!firstField) return undefined;
    
    return this.errors[firstField][0];
  }
  
  public getFieldErrors(field: string): string[] | undefined {
    return this.errors?.[field];
  }
}
