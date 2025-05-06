"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const response_js_1 = require("../utils/response.js");
const errors_js_1 = require("../utils/errors.js");
// Register a new user
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(req, res) {
        try {
            console.log('reached register, ', req.body);
            const result = await this.authService.registerUser(req.body);
            console.log(result, 'result registering user from controller');
            res.status(201).json((0, response_js_1.successResponse)(result.user, "User created success fully."));
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
    ;
    async login(req, res) {
        try {
            console.log('trigered', req.body);
            const result = await this.authService.loginUser(req.body);
            console.log('response,', result);
            res.status(200).json((0, response_js_1.successResponse)(result, "User created success fully."));
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
    ;
}
exports.AuthController = AuthController;
//   async getProfile (req: Request, res: Response): Promise<void>{
//     try {
//         let id = req.
//       const user = await this.authService.getUserById(req.user._id);
//       res.status(200).json({
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//       });
//     } catch (error) {
//       res.status(404).json({ message: error instanceof Error ? error.message : 'An error occurred' });
//     }
//   };
