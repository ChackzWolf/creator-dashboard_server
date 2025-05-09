import express from 'express';
import { SocialAuthController } from '../controllers/socialAuthController.js';
import { adminAuthenticateToken, authenticateToken } from '../utils/middleware/authMiddleware.js';
import { SocialAccountService } from '../services/socialMediaService.js';
import { SocialAccountRepository } from '../repositories/socialAccount.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { SocialPostRepository } from '../repositories/socialPost.repository.js';
import { PostLikeRepository } from '../repositories/postLIke.repository.js';
import { UserService } from '../services/userService.js';
import { ReportService } from '../services/reportService.js';
import { ReportedPostRepository } from '../repositories/report.repository.js';
const router = express.Router();

const socialMediaRepository = new SocialAccountRepository()
const socialPostRepository = new SocialPostRepository()
const userRepository = new UserRepository()
const postlikeRepository = new PostLikeRepository()
const socialMediaService = new SocialAccountService(socialMediaRepository,socialPostRepository,userRepository, postlikeRepository) 
const userService = new UserService(userRepository)
const reportRepository = new ReportedPostRepository()
const reportService = new ReportService(reportRepository)
const authSocialcontroller = new SocialAuthController(socialMediaService,userService,reportService)


router.post('/reddit/token',authenticateToken , authSocialcontroller.getRedditAccessToken.bind(authSocialcontroller) )
router.post('/reddit/post', authenticateToken , authSocialcontroller.addRedditPost.bind(authSocialcontroller))
router.post('/feed/toggle-like', authenticateToken, authSocialcontroller.toggleLike.bind(authSocialcontroller))
router.post('/feed/save', authenticateToken, authSocialcontroller.savePost.bind(authSocialcontroller))
router.post('/feed/report', authenticateToken, authSocialcontroller.submitReport.bind(authSocialcontroller))
router.get('/feed/saved', authenticateToken, authSocialcontroller.fetchSavedPosts.bind(authSocialcontroller))
router.get('/feed',authenticateToken , authSocialcontroller.getFeed.bind(authSocialcontroller))
router.get('/feed/:id', authenticateToken, authSocialcontroller.fetchPostById.bind(authSocialcontroller))

router.get('/reports',adminAuthenticateToken, authSocialcontroller.fetchReports.bind(authSocialcontroller))

export default router
