"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
// src/repositories/user.repository.ts
const base_repository_js_1 = require("./base.repository.js");
const user_js_1 = __importDefault(require("../models/user.js"));
const userRoles_js_1 = require("../types/userRoles.js");
class UserRepository extends base_repository_js_1.BaseRepository {
    constructor() {
        super(user_js_1.default);
    }
    async findByEmail(email) {
        return this.findOne({ email });
    }
    async findByUsername(username) {
        return this.findOne({ username });
    }
    async findByEmailOrUsername(email, username) {
        return this.findOne({ $or: [{ email }, { username }] });
    }
    async findUserById(id) {
        return this.findById(id);
    }
    async createUser(username, email, password) {
        console.log('creating user');
        try {
            const createdUser = await this.create({ username, email, password, role: userRoles_js_1.UserRole.User });
            console.log('user created in repo:', createdUser);
            return createdUser;
        }
        catch (err) {
            console.error('Error in createUser:', err);
            return null;
        }
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
