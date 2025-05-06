"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const errors_js_1 = require("../utils/errors.js");
const userRoles_js_1 = require("../types/userRoles.js");
class AuthService {
    constructor(userRepository, jwt) {
        this.userRepository = userRepository;
        this.jwt = jwt;
    }
    async registerUser(userData) {
        const { username, email, password } = userData;
        console.log(userData, 'fromt service register');
        // Check if user already exists
        const emailExists = await this.userRepository.findByEmail(email);
        if (emailExists) {
            console.log('Email already exists');
            throw new errors_js_1.AppError('Email already exists', 409);
        }
        const userNameExists = await this.userRepository.findByUsername(username);
        if (userNameExists) {
            console.log('User already exists');
            throw new errors_js_1.AppError('Username already exists, try another one.', 409);
        }
        // Create user
        const user = await this.userRepository.createUser(username, email, password);
        console.log(user, 'created user');
        if (!user) {
            throw new errors_js_1.AppError('Invalid user data', 400);
        }
        // Return user data and token
        return {
            user: {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
            token: this.jwt.generateToken(user._id.toString(), userRoles_js_1.UserRole.User),
        };
    }
    ;
    async loginUser(credentials) {
        const { email, password } = credentials;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new errors_js_1.AppError('Invalid credentials', 400);
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new errors_js_1.AppError('Invalid credentials', 400);
        }
        return {
            user: {
                ...user,
                _id: user._id.toString(),
            },
            token: this.jwt.generateToken(user._id.toString(), userRoles_js_1.UserRole.User),
        };
    }
    ;
    async getUserById(id) {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    ;
}
exports.AuthService = AuthService;
