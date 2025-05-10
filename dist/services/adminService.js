"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errors_1 = require("../utils/errors");
const userRoles_1 = require("../types/userRoles");
class AdminService {
    constructor(adminResitory, jwt) {
        this.adminRepo = adminResitory;
        this.jwt = jwt;
    }
    async login(data) {
        const { email, password } = data;
        console.log(data, 'data');
        const admin = await this.adminRepo.findByEmail(email);
        if (!admin)
            throw new errors_1.AppError("Invalid credentials.", 402);
        console.log(password, '  /////  ', admin.password);
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        console.log(2);
        if (!isMatch)
            throw new errors_1.AppError('Invalid password', 402);
        console.log(3);
        return {
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
            },
            token: this.jwt.generateToken(admin._id.toString(), userRoles_1.UserRole.Admin),
        };
    }
    async getAdminProfile() {
        const response = await this.adminRepo.findOne();
        return response;
    }
}
exports.AdminService = AdminService;
