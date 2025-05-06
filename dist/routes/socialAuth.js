"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socialAuthController_js_1 = require("../controllers/socialAuthController.js");
const authMiddleware_js_1 = require("../utils/middleware/authMiddleware.js");
const socialMediaService_js_1 = require("../services/socialMediaService.js");
const socialAccount_repository_js_1 = require("../repositories/socialAccount.repository.js");
const router = express_1.default.Router();
const socialMediaRepository = new socialAccount_repository_js_1.SocialAccountRepository();
const socialMediaService = new socialMediaService_js_1.SocialAccountService(socialMediaRepository);
const authSocialcontroller = new socialAuthController_js_1.SocialAuthController(socialMediaService);
router.post('/reddit/token', authMiddleware_js_1.authenticateToken, authSocialcontroller.getRedditAccessToken.bind(authSocialcontroller));
exports.default = router;
