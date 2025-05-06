"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(data, message) {
    console.log('executing success response', data, message);
    return {
        success: true,
        data,
        message,
    };
}
function errorResponse(error, message) {
    console.log('executing error response ', error, message);
    return {
        success: false,
        error,
        message,
    };
}
