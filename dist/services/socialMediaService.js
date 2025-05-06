"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAccountService = void 0;
const env_configs_js_1 = require("../configs/env.configs.js");
const socialPlatforms_js_1 = require("../types/socialPlatforms.js");
const errors_js_1 = require("../utils/errors.js");
class SocialAccountService {
    constructor(socialMediaRepository) {
        this.socialMediaRepo = socialMediaRepository;
    }
    async addSocialAccount(data) {
        const existingAccount = await this.socialMediaRepo.findByUserIdAndPlatform(data.userId, data.platform);
        if (existingAccount) {
            return {
                message: 'Social account already exists',
                data: existingAccount,
            };
        }
        const response = await this.socialMediaRepo.create(data);
        return {
            message: 'Social account connected successfully.',
            data: response,
        };
    }
    async getSocialAccount(userId, socialPlatform) {
        if (socialPlatform === socialPlatforms_js_1.SocialPlatform.REDDIT) {
            const response = await this.socialMediaRepo.findByUserIdAndPlatform(userId, socialPlatform);
            if (!response) {
                throw new errors_js_1.AppError('Reddit social account not found', 404);
            }
            return {
                data: response,
                message: "Fetched social media account."
            };
        }
        throw new errors_js_1.AppError('Unsupported social platform', 400);
    }
    async updateSocialAccount(userId, socialPlatform, data) {
        if (socialPlatform === socialPlatforms_js_1.SocialPlatform.REDDIT) {
            const response = await this.socialMediaRepo.updateByUserId(userId, data);
            if (!response) {
                throw new errors_js_1.AppError("Could not update social account DB", 402);
            }
            return {
                message: "Social account updated",
                data: response
            };
        }
        throw new errors_js_1.AppError('Unsupported social platform', 400);
    }
    async refreshRedditToken(refreshToken) {
        const authString = Buffer.from(`${env_configs_js_1.config.REDDIT_CLIENT_ID}:${env_configs_js_1.config.REDDIT_CLIENT_SECRET}`).toString('base64');
        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'CreatorDashboard/1.0.0 by ChackzWolf'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to refresh token: ${response.status}`);
        }
        const tokenData = await response.json();
        return tokenData;
    }
}
exports.SocialAccountService = SocialAccountService;
