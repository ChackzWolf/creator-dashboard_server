import express from 'express';
import { JWT } from '../utils/jwt.utils.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AuthService } from '../services/authServices.js';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken } from '../utils/middleware/authMiddleware.js';
import { UserController } from '../controllers/userController.js';
import { UserService } from '../services/userService.js';
import { SocialAccountRepository } from '../repositories/socialAccount.repository.js';
import { SocialAccountService } from '../services/socialMediaService.js';
const router = express.Router();


const jwt = new JWT();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository,jwt);
const authController = new AuthController(authService);
const socialAccountRepository = new SocialAccountRepository() 
const socialAccountService = new SocialAccountService(socialAccountRepository)
const userService = new UserService(userRepository)
const userController = new UserController(userService, socialAccountService)
                                                          
router.post('/register',authController.register.bind(authController) )
router.post('/login', authController.login.bind(authController));
router.get('/me', authenticateToken ,  userController.getCurrentUser.bind(userController));
router.get('/linkedAccounts', authenticateToken ,  userController.getLinkedAccounts.bind(userController))
router.get('/RedditPosts', authenticateToken ,  userController.getRedditUserPosts.bind(userController))

export default router;
