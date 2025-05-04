import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/IServices/IAuthService';
import { IAuthController } from '../interfaces/IControllers/IAuthController';

// Register a new user

export class AuthController implements IAuthController {
  
  authService : IAuthService

  constructor(authService: IAuthService){
    this.authService  = authService
  }

  async register  (req: Request, res: Response): Promise<void>{
    try {
      const result = await this.authService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  };


  async login (req: Request, res: Response): Promise<void>{
    try {
      console.log('trigered', req.body)
      const result = await this.authService.loginUser(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

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

}
