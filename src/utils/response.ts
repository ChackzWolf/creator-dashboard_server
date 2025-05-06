import { ApiResponse } from '../types/apiResponse.js';

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
    console.log('executing success response', data, message);
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse<T>(error: string, message?: string): ApiResponse<T> {
    console.log('executing error response ', error, message);
    return {
    success: false,
    error,
    message,
  };
}