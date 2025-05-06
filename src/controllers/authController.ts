import { Request, response, Response } from 'express';
import { IAuthService } from '../interfaces/IServices/IAuthService.js';
import { IAuthController } from '../interfaces/IControllers/IAuthController.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { AppError } from '../utils/errors.js';
import { AuthRequest } from '../utils/middleware/authMiddleware.js';

// Register a new user

export class AuthController implements IAuthController {
  
  authService : IAuthService

  constructor(authService: IAuthService){
    this.authService  = authService
  }

  async register  (req: Request, res: Response): Promise<void>{
    try {
      console.log('reached register, ', req.body);
      const result = await this.authService.registerUser(req.body);
      console.log(result, 'result registering user from controller')
      res.status(201).json(successResponse(result.user, "User created success fully."));
    } catch (error:any) {
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
  };


  async login (req: Request, res: Response): Promise<void>{
    try {
      console.log('trigered', req.body)
      const result = await this.authService.loginUser(req.body);
      console.log('response,', result)
      res.status(200).json(successResponse(result, "User created success fully."));
      
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
  };

  // async getCurrentUser(req: AuthRequest, res: Response){
  //   try {
  //     const userId = req.userId
  //     const response = await 
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       const statusCode = error.statusCode;
  //       const message = error.message || 'An unexpected error occurred';
  //       console.log(`Handling AppError: ${message} (status: ${statusCode})`);
  //       res.status(statusCode).json(errorResponse(message));
  //     } else {
  //       console.log('Unknown error occurred', error);
  //       res.status(500).json(errorResponse('An unexpected error occurred'));
  //     } 
  //   }
  }

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


