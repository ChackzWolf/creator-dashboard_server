"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const errors_1 = require("../utils/errors");
const mongoose_1 = require("mongoose");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUserById(id) {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        return user;
    }
    ;
    async savePostToUser(userId, postId) {
        const response = await this.userRepository.toggleSavePost(userId, postId);
        return response?.savedPosts.includes(new mongoose_1.Types.ObjectId(postId)) || false;
    }
    async fetchUsers(search = null) {
        const users = await this.userRepository.getUsers(search);
        return users;
    }
}
exports.UserService = UserService;
