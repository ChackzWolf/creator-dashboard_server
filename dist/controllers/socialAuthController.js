"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthController = void 0;
const env_configs_js_1 = require("../configs/env.configs.js");
const socialPlatforms_js_1 = require("../types/socialPlatforms.js");
const response_js_1 = require("../utils/response.js");
const errors_js_1 = require("../utils/errors.js");
class SocialAuthController {
    constructor(socialMediaService, userService, reportService) {
        this.socialMediaService = socialMediaService;
        this.userService = userService;
        this.reportService = reportService;
    }
    async getRedditAccessToken(req, res) {
        console.log('token reddit triggered', req.body);
        const { code, userId } = req.body;
        // Add request ID to track multiple simultaneous requests
        const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        console.log(`[${requestId}] Processing Reddit auth with code: ${code.substring(0, 5)}...`);
        // Prevent duplicate processing by checking if response is already sent
        let isResponseSent = false;
        // Log the credentials being used
        console.log(`[${requestId}] Using credentials:`, {
            codeLength: code.length,
            clientId: env_configs_js_1.config.REDDIT_CLIENT_ID,
            secretLength: env_configs_js_1.config.REDDIT_CLIENT_SECRET ? env_configs_js_1.config.REDDIT_CLIENT_SECRET.length : 0,
            uri: env_configs_js_1.config.REDDIT_REDIRECT_URI
        });
        try {
            // Create the authorization string
            const authString = Buffer.from(`${env_configs_js_1.config.REDDIT_CLIENT_ID}:${env_configs_js_1.config.REDDIT_CLIENT_SECRET}`).toString('base64');
            let profileData = null;
            let platformUserId = null;
            let platformUsername = null;
            // Log the request details (without exposing full credentials)
            console.log(`[${requestId}] Making token request to Reddit with:`);
            console.log(`[${requestId}] - Auth header prefix: Basic ${authString.substring(0, 10)}...`);
            console.log(`[${requestId}] - Redirect URI: ${env_configs_js_1.config.REDDIT_REDIRECT_URI}`);
            console.log(`[${requestId}] - Code length: ${code.length}`);
            // Make the token request
            const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'CreatorDashboard/1.0.0 by ChackzWolf'
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: env_configs_js_1.config.REDDIT_REDIRECT_URI,
                }),
            });
            // Log the response status
            console.log(`[${requestId}] Reddit token response status:`, tokenResponse.status);
            const rawText = await tokenResponse.text();
            console.log(`[${requestId}] Reddit token raw response:`, rawText);
            let tokenData;
            try {
                tokenData = JSON.parse(rawText);
            }
            catch (error) {
                console.error(`[${requestId}] ❌ Reddit token exchange failed. Response was not JSON:`, rawText);
                if (!isResponseSent) {
                    isResponseSent = true;
                    res.status(500).json({ error: "Invalid response from Reddit (not JSON)" });
                    return;
                }
                return;
            }
            if (!tokenData.access_token) {
                console.error(`[${requestId}] ❌ Reddit response did not include access_token:`, tokenData);
                // Check for specific error cases
                if (tokenData.error === 'invalid_grant') {
                    if (!isResponseSent) {
                        isResponseSent = true;
                        res.status(400).json({
                            error: "Invalid authorization code. It may be expired or already used.",
                            details: tokenData
                        });
                        return;
                    }
                    return;
                }
                if (tokenData.error === 'unsupported_grant_type') {
                    if (!isResponseSent) {
                        isResponseSent = true;
                        res.status(400).json({
                            error: "Unsupported grant type. Check Reddit API documentation.",
                            details: tokenData
                        });
                        return;
                    }
                    return;
                }
                if (tokenData.error === 'invalid_client') {
                    if (!isResponseSent) {
                        isResponseSent = true;
                        res.status(401).json({
                            error: "Invalid client credentials (ID or secret).",
                            details: tokenData
                        });
                        return;
                    }
                    return;
                }
                if (!isResponseSent) {
                    isResponseSent = true;
                    res.status(500).json({
                        error: "Reddit did not provide an access token",
                        details: tokenData
                    });
                    return;
                }
                return;
            }
            console.log(`[${requestId}] ✅ Successfully obtained access token from Reddit`);
            // Fetch user profile with the access token
            try {
                const profileResponse = await fetch("https://oauth.reddit.com/api/v1/me", {
                    headers: {
                        'Authorization': `Bearer ${tokenData.access_token}`,
                        'User-Agent': "CreatorDashboard/1.0.0 by ChackzWolf",
                    },
                });
                console.log(`[${requestId}] Profile response status:`, profileResponse.status);
                const expiryDate = new Date(Date.now() + tokenData.expires_in * 1000);
                if (!profileResponse.ok) {
                    console.error(`[${requestId}] ❌ Failed to fetch profile:`, profileResponse.status, profileResponse.statusText);
                    // Don't block the token response
                }
                else {
                    const profileData = await profileResponse.json();
                    platformUserId = profileData.id;
                    platformUsername = profileData.name;
                    console.log(`[${requestId}] 👤 Reddit Profile:`, profileData);
                }
                const socialAccountData = {
                    userId: userId,
                    platform: socialPlatforms_js_1.SocialPlatform.REDDIT,
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                    platformUserId: platformUserId,
                    platformUsername: platformUsername,
                    profileData: profileData,
                };
                const response = await this.socialMediaService.addSocialAccount(socialAccountData);
                res.status(200).json((0, response_js_1.successResponse)(tokenData, response.message));
                return;
            }
            catch (profileErr) {
                console.error(`[${requestId}] ❌ Error fetching profile:`, profileErr);
                // Don't block the token response
            }
            if (!isResponseSent) {
                isResponseSent = true;
                res.json((0, response_js_1.successResponse)(tokenData, "response token"));
                return;
            }
        }
        catch (err) {
            console.error(`[${requestId}] ❌ Error exchanging token:`, err);
            if (!isResponseSent) {
                isResponseSent = true;
                res.status(500).json({ error: 'Failed to exchange token' });
                return;
            }
        }
    }
    async getRedditPosts(req, res) {
        try {
            const { userId } = req.params;
            // Get the social account from database
            const result = await this.socialMediaService.getSocialAccount(userId, socialPlatforms_js_1.SocialPlatform.REDDIT);
            if (!result) {
                throw new Error;
            }
            const socialAccount = result.data;
            // Check if token is expired and needs refresh
            const now = new Date();
            if (now >= socialAccount.tokenExpiry) {
                try {
                    // Refresh the token
                    const newTokenData = await this.socialMediaService.refreshRedditToken(socialAccount.refreshToken);
                    // Update the token in database
                    const expiryDate = new Date(Date.now() + newTokenData.expires_in * 1000);
                    await this.socialMediaService.updateSocialAccount(userId, socialPlatforms_js_1.SocialPlatform.REDDIT, {
                        accessToken: newTokenData.access_token,
                        tokenExpiry: expiryDate
                    });
                    // Update the token for the current request
                    socialAccount.accessToken = newTokenData.access_token;
                }
                catch (refreshError) {
                    console.error("Failed to refresh Reddit token:", refreshError);
                    return res.status(401).json({ error: "Reddit authentication expired. Please reconnect your account." });
                }
            }
            // Fetch posts from Reddit API
            const response = await fetch('https://oauth.reddit.com/user/me/submitted?limit=25', {
                headers: {
                    'Authorization': `Bearer ${socialAccount.accessToken}`,
                    'User-Agent': 'CreatorDashboard/1.0.0 by ChackzWolf',
                },
            });
            if (!response.ok) {
                return res.status(response.status).json({
                    error: 'Failed to fetch Reddit posts',
                    details: { status: response.status }
                });
            }
            const postsData = await response.json();
            return res.status(200).json((0, response_js_1.successResponse)(postsData.data, "Reddit posts fetched successfully"));
        }
        catch (error) {
            console.error('Error fetching Reddit posts:', error);
            return res.status(500).json({ error: 'Failed to fetch Reddit posts' });
        }
    }
    async addRedditPost(req, res) {
        try {
            console.log(req.body);
            const userId = req.userId;
            console.log(userId);
            const { platformPostId, author, title, mediaUrls, platformUrl, postedAt, platformData, content } = req.body;
            if (!userId || !platformPostId || !title) {
                res.status(400).json({ error: "Missing required post data" });
                return;
            }
            const postData = {
                userId,
                platform: socialPlatforms_js_1.SocialPlatform.REDDIT,
                platformPostId,
                title,
                author,
                content: content || '',
                mediaUrls,
                platformUrl,
                postedAt,
                platformData,
                createdAt: new Date()
            };
            console.log(postData, 'post data');
            const savedPost = await this.socialMediaService.createRedditPost(postData);
            console.log(savedPost, 'saved post');
            res.status(200).json((0, response_js_1.successResponse)(savedPost, "Reddit post saved successfully"));
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async getFeed(req, res) {
        try {
            // Parse query parameters
            let myUserId = req.userId;
            const userId = req.query.userId; // Optional - only if viewing a specific user's feed
            const sources = req.query.sources
                ? req.query.sources.split(',')
                : undefined;
            const sortBy = req.query.sortBy || 'recent';
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            if (!myUserId) {
                myUserId = '123123123123';
            }
            // Get feed items
            const feedItems = await this.socialMediaService.getFeed({
                userId,
                sources,
                sortBy,
                page,
                limit
            }, myUserId);
            res.status(200).json({
                success: true,
                data: feedItems,
                message: 'Feed items fetched successfully'
            });
            return;
        }
        catch (error) {
            console.error('Error fetching feed:', error);
            if (error instanceof errors_js_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: 'Failed to fetch feed items'
            });
            return;
        }
    }
    async fetchSavedPosts(req, res) {
        try {
            const userId = req.userId;
            if (!userId)
                throw new errors_js_1.AppError("UserId cannot be found.");
            const feedItems = await this.socialMediaService.fetchSavedPosts(userId);
            res.status(200).json({
                success: true,
                data: feedItems,
                message: 'Feed items fetched successfully'
            });
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async toggleLike(req, res) {
        try {
            const postId = req.body.postId;
            const userId = req.userId;
            if (!userId) {
                throw new errors_js_1.AppError("User id not found in jwt", 404);
            }
            const response = await this.socialMediaService.toggleLikes(postId, userId);
            res.status(201).json((0, response_js_1.successResponse)(response));
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async savePost(req, res) {
        try {
            const userId = req.userId;
            if (!userId)
                throw new errors_js_1.AppError("User id not found ", 404);
            const postId = req.body.postId;
            const response = await this.userService.savePostToUser(userId, postId);
            res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async submitReport(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new errors_js_1.AppError("User Id not found.");
            }
            const data = {
                ...req.body.data,
                reportedBy: userId
            };
            console.log(data);
            const response = await this.reportService.submitReport(data);
            res.status(201).json((0, response_js_1.successResponse)(response));
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async fetchReports(req, res) {
        try {
            const response = await this.reportService.fetchReports();
            res.status(200).json((0, response_js_1.successResponse)(response));
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
    async fetchPostById(req, res) {
        try {
            const postId = req.params.id;
            const response = await this.socialMediaService.fetchPostById(postId);
            res.status(200).json((0, response_js_1.successResponse)(response));
        }
        catch (error) {
            if (error instanceof errors_js_1.AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json((0, response_js_1.errorResponse)(message));
            }
            else {
                console.log('Unknown error occurred', error);
                res.status(500).json((0, response_js_1.errorResponse)('An unexpected error occurred'));
            }
        }
    }
}
exports.SocialAuthController = SocialAuthController;
