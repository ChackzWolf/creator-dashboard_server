import { IUserController } from "../interfaces/IControllers/IUserController.js";
import { ISocialAccountService } from "../interfaces/IServices/ISocialMediaService.js";
import { IUserService } from "../interfaces/IServices/IUserService.js";
import { AppError } from "../utils/errors.js";
import { AuthRequest, CustomRequest } from "../utils/middleware/authMiddleware.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { Response } from "express";

export class UserController implements IUserController {

    userService: IUserService
    socialAccountService: ISocialAccountService

    constructor(userService: IUserService, socialAccountService: ISocialAccountService) {
        this.userService = userService;
        this.socialAccountService = socialAccountService
    }

    async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.userId
            if (!userId) {
                throw new Error('userId not found');
            }
            const response = await this.userService.getUserById(userId)
            res.status(200).json(successResponse(response, 'user data'))
        } catch (error) {
            if (error instanceof AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json(errorResponse(message));
            } else {
                console.log('Unknown error occurred', error);
                res.status(500).json(errorResponse('An unexpected error occurred'));
            }
        }
    }

    async getLinkedAccounts(req: CustomRequest, res: Response) {
        try {
            const userId = req.userId
            if (!userId) {
                throw new Error('userId not found');
            }
            const response = await this.socialAccountService.getLinkedAccountsByUserId(userId)
            res.status(200).json(successResponse(response))
        } catch (error) {
            if (error instanceof AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json(errorResponse(message));
            } else {
                console.log('Unknown error occurred', error);
                res.status(500).json(errorResponse('An unexpected error occurred'));
            }
        }
    }
    async getRedditUserPosts(req: CustomRequest, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new Error('userId not found');
            }
            console.log('trigg', userId)
            const response = await this.socialAccountService.getRedditUserPosts(userId)
            console.log('done', response)

            res.status(200).json(successResponse(response.data, response.message));
        } catch (error) {
 
            if (error instanceof AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json(errorResponse(message));
            } else {
                console.log('Unknown error occurred', error);
                res.status(500).json(errorResponse('An unexpected error occurred'));
            }
        }
    }
}