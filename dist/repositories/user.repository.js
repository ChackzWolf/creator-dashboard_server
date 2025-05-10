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
const mongoose_1 = require("mongoose");
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
    async toggleSavePost(userId, postId) {
        const user = await this.findById(userId.toString());
        if (!user)
            return null;
        const objectPostId = new mongoose_1.Types.ObjectId(postId);
        const alreadySaved = user.savedPosts.some(savedId => savedId.equals(objectPostId));
        const updateOp = alreadySaved
            ? { $pull: { savedPosts: objectPostId } }
            : { $addToSet: { savedPosts: objectPostId } };
        return await this.update(userId.toString(), updateOp);
    }
    async getUsers(search) {
        let query = {};
        console.log('filter:', search);
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }
        return await user_js_1.default.find(query);
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
