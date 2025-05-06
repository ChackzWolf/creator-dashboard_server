"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const errors_1 = require("../utils/errors");
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
}
exports.UserService = UserService;
