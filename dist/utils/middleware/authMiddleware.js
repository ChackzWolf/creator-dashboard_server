"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthenticateToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_js_1 = require("../errors.js");
const userRoles_js_1 = require("../../types/userRoles.js");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return next(new errors_js_1.AppError('No token provided', 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        next(new errors_js_1.AppError('Invalid token', 403));
    }
};
exports.authenticateToken = authenticateToken;
const adminAuthenticateToken = (req, _res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return next(new errors_js_1.AppError('No token provided', 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded, 'decoded');
        if (userRoles_js_1.UserRole.Admin === decoded.role) {
            next();
        }
    }
    catch (err) {
        next(new errors_js_1.AppError('Unautherized', 403));
    }
};
exports.adminAuthenticateToken = adminAuthenticateToken;
