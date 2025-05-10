"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const errors_js_1 = require("../utils/errors.js");
const response_js_1 = require("../utils/response.js");
class UserController {
    constructor(userService, socialAccountService) {
        this.userService = userService;
        this.socialAccountService = socialAccountService;
    }
    async getCurrentUser(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new Error('userId not found');
            }
            const response = await this.userService.getUserById(userId);
            res.status(200).json((0, response_js_1.successResponse)(response, 'user data'));
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async getLinkedAccounts(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new Error('userId not found');
            }
            const response = await this.socialAccountService.getLinkedAccountsByUserId(userId);
            res.status(200).json((0, response_js_1.successResponse)(response));
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async getRedditUserPosts(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new Error('userId not found');
            }
            console.log('trigg', userId);
            const response = await this.socialAccountService.getRedditUserPosts(userId);
            console.log('done', response);
            res.status(200).json((0, response_js_1.successResponse)(response.data, response.message));
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
}
exports.UserController = UserController;
