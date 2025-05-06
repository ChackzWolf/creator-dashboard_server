import express from 'express';
import { SocialAuthController } from '../controllers/socialAuthController.js';
import { authenticateToken } from '../utils/middleware/authMiddleware.js';
import { SocialAccountService } from '../services/socialMediaService.js';
import { SocialAccountRepository } from '../repositories/socialAccount.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { SocialPostRepository } from '../repositories/socialPost.repository.js';
const router = express.Router();

const socialMediaRepository = new SocialAccountRepository()
const socialPostRepository = new SocialPostRepository()
const userRepository = new UserRepository()
const socialMediaService = new SocialAccountService(socialMediaRepository,socialPostRepository,userRepository) 
const authSocialcontroller = new SocialAuthController(socialMediaService)

router.post('/reddit/token',authenticateToken , authSocialcontroller.getRedditAccessToken.bind(authSocialcontroller) )
router.post('/reddit/post', authenticateToken , authSocialcontroller.addRedditPost.bind(authSocialcontroller) )
router.get('/feed',authenticateToken , authSocialcontroller.getFeed.bind(authSocialcontroller) )

export default router
