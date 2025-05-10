"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const response_1 = require("../utils/response");
const errors_1 = require("../utils/errors");
class AdminController {
    constructor(adminService, reportService, userService) {
        this.adminService = adminService;
        this.reportService = reportService;
        this.userService = userService;
    }
    async login(req, res) {
        try {
            console.log('reached login controller ', req.body);
            const response = await this.adminService.login(req.body.credentials);
            console.log(response);
            res.status(201).json((0, response_1.successResponse)(response, "Admin login successful"));
        }
        catch (error) {
            if (error instanceof errors_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(400).json((0, response_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async getProfile(_req, res) {
        try {
            const response = await this.adminService.getAdminProfile();
            res.status(200).json((0, response_1.successResponse)(response));
        }
        catch (error) {
            console.log('Unknown error occurred', error);
            res.status(400).json((0, response_1.errorResponse)('An unexpected error occurred'));
        }
    }
    async updateReportStatus(req, res) {
        try {
            console.log('started', req.body);
            const data = req.body;
            const response = await this.reportService.updateReportStatus(data);
            console.log(response, 'statuss');
            res.status(201).json((0, response_1.successResponse)(response));
        }
        catch (error) {
            console.log('Unknown error occurred', error);
            res.status(400).json((0, response_1.errorResponse)('An unexpected error occurred'));
        }
    }
    async getUserList(req, res) {
        try {
            const { search } = req.query;
            console.log(req.query, 'data//////////////////////////');
            const response = await this.userService.fetchUsers(search);
            res.status(200).json((0, response_1.successResponse)(response));
        }
        catch (error) {
            res.status(400).json((0, response_1.errorResponse)("Something went wrong."));
        }
    }
}
exports.AdminController = AdminController;
