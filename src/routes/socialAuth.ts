import express from 'express';
import { SocialAuthController } from '../controllers/socialAuthController';
import { authenticateToken } from '../utils/middleware/authMiddleware';
import { SocialAccountService } from '../services/socialMediaService';
import { SocialAccountRepository } from '../repositories/socialAccount.repository';
const router = express.Router();

const socialMediaRepository = new SocialAccountRepository()
const socialMediaService = new SocialAccountService(socialMediaRepository) 
const authSocialcontroller = new SocialAuthController(socialMediaService)

router.post('/reddit/token',authenticateToken ,authSocialcontroller.getRedditAccessToken.bind(authSocialcontroller) )

export default router
