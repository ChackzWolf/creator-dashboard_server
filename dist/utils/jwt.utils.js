"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_configs_js_1 = require("../configs/env.configs.js");
class JWT {
    generateToken(id, role) {
        return jsonwebtoken_1.default.sign({ id, role }, env_configs_js_1.config.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
    }
    ;
}
exports.JWT = JWT;
