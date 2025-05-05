import { IUserController } from "../interfaces/IControllers/IUserController";
import { IUserService } from "../interfaces/IServices/IUserService";
import { AppError } from "../utils/errors";
import { AuthRequest } from "../utils/middleware/authMiddleware";
import { errorResponse, successResponse } from "../utils/response";
import { Response } from "express";

export class UserController implements IUserController{

    userService:IUserService

    constructor(userService:IUserService){
        this.userService= userService;
    }
    
    async getCurrentUser(req: AuthRequest, res: Response):Promise<void>{
        try {
          const userId = req.userId
            if(!userId){
                throw new Error('userId not found');
            }
            const response = this.userService.getUserById(userId)
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
}