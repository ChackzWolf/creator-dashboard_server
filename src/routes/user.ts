import express from 'express';
import { JWT } from '../utils/jwt.utils';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/authServices';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../utils/middleware/authMiddleware';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
const router = express.Router();


const jwt = new JWT();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository,jwt);
const authController = new AuthController(authService);

const userService = new UserService(userRepository)
const userController = new UserController(userService)
                                                          
router.post('/register',authController.register.bind(authController) )
router.post('/login', authController.login.bind(authController));
router.get('/me', authenticateToken ,  userController.getCurrentUser.bind(userController));

export default router;
