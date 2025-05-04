import express from 'express';
import { JWT } from '../utils/jwt.utils';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/authServices';
import { AuthController } from '../controllers/authController';
const router = express.Router();


const jwt = new JWT();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository,jwt);
const authController = new AuthController(authService);
                                                          
router.post('/register',authController.register.bind(authController) )

export default router;
