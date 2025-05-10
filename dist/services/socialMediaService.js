"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAccountService = void 0;
const env_configs_js_1 = require("../configs/env.configs.js");
const socialPlatforms_js_1 = require("../types/socialPlatforms.js");
const errors_js_1 = require("../utils/errors.js");
const mongoose_1 = require("mongoose");
class SocialAccountService {
    constructor(socialMediaRepository, socialPostRepository, userRepository, postLikeRepo) {
        this.socialMediaRepo = socialMediaRepository;
        this.socialPostRepo = socialPostRepository;
        this.userRepository = userRepository;
        this.postLikeRepo = postLikeRepo;
    }
    async addSocialAccount(data) {
        console.log('data', data);
        const existingAccount = await this.socialMediaRepo.findByUserIdAndPlatform(data.userId, data.platform);
        if (existingAccount) {
            return {
                message: 'Social account already exists',
                data: existingAccount,
            };
        }
        const response = await this.socialMediaRepo.create(data);
        console.log(response);
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
        try {
            const authString = Buffer.from(`${env_configs_js_1.config.REDDIT_CLIENT_ID}:${env_configs_js_1.config.REDDIT_CLIENT_SECRET}`).toString('base64');
            console.log("Refreshing Reddit token...");
            const response = await fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'web:CreatorDashboard:v1.0.0 (by /u/ChackzWolf)'
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                }),
            });
            console.log("Token refresh response status:", response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Token refresh error response:", errorText);
                throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
            }
            const tokenData = await response.json();
            if (!tokenData.access_token) {
                console.error("Token refresh response missing access_token:", tokenData);
                throw new Error("Invalid token refresh response: missing access_token");
            }
            console.log("Token refresh successful, new token:", tokenData.access_token.substring(0, 10) + "...");
            return tokenData;
        }
        catch (error) {
            console.error("Error in refreshRedditToken:", error);
            throw error;
        }
    }
    async getLinkedAccountsByUserId(userId) {
        const response = await this.socialMediaRepo.listByUserId(userId);
        return response;
    }
    async getRedditUserPosts(userId) {
        try {
            // Find the user's Reddit account details
            const socialAccount = await this.socialMediaRepo.findByUserIdAndPlatform(userId, socialPlatforms_js_1.SocialPlatform.REDDIT);
            if (!socialAccount) {
                throw new errors_js_1.AppError("Reddit account not connected for this user", 404);
            }
            // Check if token is expired and needs refreshing
            const now = new Date();
            if (now >= socialAccount.tokenExpiry) {
                try {
                    console.log("Token expired, refreshing...");
                    const newTokens = await this.refreshRedditToken(socialAccount.refreshToken);
                    // Update tokens in database
                    const expiryDate = new Date(Date.now() + newTokens.expires_in * 1000);
                    socialAccount.accessToken = newTokens.access_token;
                    socialAccount.tokenExpiry = expiryDate;
                    await socialAccount.save();
                    console.log("Token refreshed successfully");
                }
                catch (refreshError) {
                    console.error("Failed to refresh Reddit token:", refreshError);
                    throw new errors_js_1.AppError("Reddit authentication expired. Please reconnect your account.", 401);
                }
            }
            // Try a simpler Reddit API endpoint first to verify token works
            console.log("Testing token with identity endpoint...");
            const identityResponse = await fetch('https://oauth.reddit.com/api/v1/me', {
                headers: {
                    'Authorization': `Bearer ${socialAccount.accessToken}`,
                    'User-Agent': 'web:CreatorDashboard:v1.0.0 (by /u/ChackzWolf)'
                }
            });
            if (!identityResponse.ok) {
                const identityErrorText = await identityResponse.text();
                console.error("Reddit identity API failed:", identityErrorText);
                throw new errors_js_1.AppError(`Reddit token validation failed: ${identityResponse.status}`, 401);
            }
            else {
                console.log("Identity check successful, token is valid");
            }
            // Now try to get the user's posts
            console.log("Making request to Reddit API for posts...");
            const response = await fetch(`https://oauth.reddit.com/user/${socialAccount.platformUsername}/submitted`, {
                headers: {
                    'Authorization': `Bearer ${socialAccount.accessToken}`,
                    'User-Agent': 'web:CreatorDashboard:v1.0.0 (by /u/ChackzWolf)'
                }
            });
            console.log("Reddit API response status:", response);
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Reddit API error:", errorText);
                // If token unauthorized, try refreshing token
                if (response.status === 401) {
                    console.log("Unauthorized response, attempting to refresh token...");
                    try {
                        const newTokens = await this.refreshRedditToken(socialAccount.refreshToken);
                        // Update tokens in database
                        const expiryDate = new Date(Date.now() + newTokens.expires_in * 1000);
                        socialAccount.accessToken = newTokens.access_token;
                        socialAccount.tokenExpiry = expiryDate;
                        await socialAccount.save();
                        // Retry the request with new token
                        console.log("Retrying with new token...");
                        const retryResponse = await fetch(`https://oauth.reddit.com/user/${socialAccount.platformUsername}/submitted`, {
                            headers: {
                                'Authorization': `Bearer ${newTokens.access_token}`,
                                'User-Agent': 'web:CreatorDashboard:v1.0.0 (by /u/ChackzWolf)'
                            }
                        });
                        console.log(retryResponse, '//////////////////////////////2');
                        if (!retryResponse.ok) {
                            throw new errors_js_1.AppError(`Failed to fetch Reddit posts after token refresh: ${retryResponse.status}`, 400);
                        }
                        const postsData = await retryResponse.json();
                        console.log(postsData, '//////////////////////////////');
                        return {
                            data: postsData.data.children,
                            message: "Reddit posts fetched successfully after token refresh"
                        };
                    }
                    catch (refreshError) {
                        console.error("Token refresh attempt failed:", refreshError);
                        throw new errors_js_1.AppError("Reddit authentication failed. Please reconnect your account.", 401);
                    }
                }
                throw new errors_js_1.AppError(`Failed to fetch Reddit posts: ${response.status} ${response.statusText}`, 400);
            }
            const postsData = await response.json();
            // Validate the response structure
            if (!postsData || !postsData.data || !postsData.data.children) {
                console.error("Unexpected Reddit API response structure:", postsData);
                throw new errors_js_1.AppError("Invalid response format from Reddit API", 500);
            }
            console.log(`Successfully fetched ${postsData.data.children.length} Reddit posts`);
            return {
                data: postsData.data.children,
                message: "Reddit posts fetched successfully"
            };
        }
        catch (error) {
            console.error("Error fetching Reddit posts:", error);
            if (error instanceof errors_js_1.AppError) {
                throw error;
            }
            throw new errors_js_1.AppError(`Error fetching Reddit posts: ${error.message}`, 500);
        }
    }
    async createRedditPost(postData) {
        // Fetch the user data to build the author
        console.log('trig');
        const user = await this.userRepository.findUserById(postData.userId);
        if (!user) {
            throw new errors_js_1.AppError('User not found', 404);
        }
        const postExists = await this.socialPostRepo.findByPlatformId(postData.userId, socialPlatforms_js_1.SocialPlatform.REDDIT, postData.platformPostId);
        if (postExists) {
            throw new errors_js_1.AppError("Post already exists", 402);
        }
        // Construct the 'author' object - use the provided author info from Reddit
        // but include our user's avatar if available
        const author = {
            name: postData.author.name || user.username || "",
            username: postData.author.username || user.username || "",
            avatar: user.profilePicture || postData.author.avatar || "",
        };
        // Prepare media URLs from the incoming data
        const mediaUrls = postData.mediaUrls || [];
        console.log('mediaUrls', mediaUrls);
        // Create a new SocialPost object
        const socialPost = {
            userId: new mongoose_1.Types.ObjectId(postData.userId),
            platform: socialPlatforms_js_1.SocialPlatform.REDDIT,
            platformPostId: postData.platformPostId,
            title: postData.title || '',
            content: postData.content || '',
            author,
            mediaUrls: mediaUrls,
            platformUrl: postData.platformUrl, // Use platformUrl instead of url
            postedAt: new Date(postData.postedAt), // Convert string date to Date object
            platformData: postData.platformData || {},
            likes: 0, // Default engagement metrics
            comments: 0,
            shares: 0,
        };
        // Save the post to the database
        return await this.socialPostRepo.create(socialPost);
    }
    async getFeed(filters, myUserId) {
        try {
            // Get posts from repository
            const posts = await this.socialPostRepo.findFeedPosts({
                userId: filters.userId, // Optional - only if viewing a specific user's feed
                sources: filters.sources,
                sortBy: filters.sortBy,
                page: filters.page || 1,
                limit: filters.limit || 20
            });
            // Transform posts to FeedItem format
            const response = await Promise.all(posts.map(post => this.transformPostToFeedItem(post, myUserId)));
            return response;
        }
        catch (error) {
            console.error('Error in getFeed:', error);
            throw error;
        }
    }
    async transformPostToFeedItem(post, myUserId = null) {
        // Initialize empty media array
        const media = [];
        // Check if we have platform data with video information
        if (post.platformData && typeof post.platformData === 'object') {
            const platformData = post.platformData; // Use type assertion to avoid TS errors
            // Check for Reddit video
            if (platformData.is_video === true &&
                platformData.media &&
                platformData.media.reddit_video &&
                platformData.media.reddit_video.fallback_url) {
                // Add Reddit video
                media.push({
                    type: "video",
                    url: platformData.media.reddit_video.fallback_url
                });
            }
            // Check for direct URL that might be a video or image
            else if (platformData.url) {
                const url = platformData.url;
                // Determine if it's a video or image
                const isVideo = url.includes('.mp4') ||
                    url.includes('.mov') ||
                    url.includes('v.redd.it');
                media.push({
                    type: isVideo ? "video" : "image",
                    url: url
                });
            }
        }
        // If no media found in platform data, use mediaUrls as fallback
        if (media.length === 0 && post.mediaUrls && post.mediaUrls.length > 0) {
            post.mediaUrls.forEach(url => {
                const isVideo = url.includes('.mp4') ||
                    url.includes('.mov') ||
                    url.includes('v.redd.it');
                media.push({
                    type: isVideo ? "video" : "image",
                    url: url
                });
            });
        }
        const postId = post._id;
        const isLiked = myUserId ? await this.postLikeRepo.isLikedByUser(myUserId, postId) : false;
        const likes = myUserId ? await this.postLikeRepo.countLikes(postId) : 0;
        const user = myUserId ? await this.userRepository.findUserById(myUserId) : null;
        const isSaved = myUserId ? user?.savedPosts.includes(new mongoose_1.Types.ObjectId(postId)) || false : false;
        return {
            id: String(post._id),
            platformData: post.platformData,
            source: post.platform,
            sourceId: post.platformPostId,
            content: post.title ? `${post.title}\n\n${post.content}` : post.content,
            author: {
                name: post.author.name,
                avatar: post.author.avatar,
                username: post.author.username
            },
            createdAt: post.postedAt.toISOString(),
            media: media.length > 0 ? media : undefined,
            likes,
            comments: post.comments,
            shares: post.shares,
            isSaved,
            isLiked,
            userId: post.userId.toString()
        };
    }
    async toggleLikes(postId, userId) {
        const response = await this.postLikeRepo.toggleLike(postId, userId);
        return response;
    }
    async fetchSavedPosts(userId) {
        const user = await this.userRepository.findUserById(userId);
        const postIds = user?.savedPosts;
        const posts = await this.socialPostRepo.findPostsByIds(postIds);
        const response = await Promise.all(posts.map(post => this.transformPostToFeedItem(post, userId)));
        return response;
    }
    async fetchPostById(id) {
        const post = await this.socialPostRepo.findById(id);
        if (!post) {
            throw new errors_js_1.AppError("Connot find post by this id.", 404);
        }
        const processedPost = await this.transformPostToFeedItem(post);
        return processedPost;
    }
}
exports.SocialAccountService = SocialAccountService;
