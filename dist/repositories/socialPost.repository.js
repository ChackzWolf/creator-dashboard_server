"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialPostRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const socialPost_js_1 = __importDefault(require("../models/socialPost.js"));
class SocialPostRepository {
    async findById(id) {
        try {
            return await socialPost_js_1.default.findById(id);
        }
        catch (error) {
            console.error(`Error finding post by ID ${id}:`, error);
            throw error;
        }
    }
    async findByPlatformId(userId, platform, platformPostId) {
        try {
            return await socialPost_js_1.default.findOne({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                platform,
                platformPostId
            });
        }
        catch (error) {
            console.error(`Error finding post by platform ID ${platformPostId}:`, error);
            throw error;
        }
    }
    async findAll(filters = {}, page = 1, limit = 20) {
        try {
            const query = this.buildQuery(filters);
            const skip = (page - 1) * limit;
            const total = await socialPost_js_1.default.countDocuments(query);
            const posts = await socialPost_js_1.default.find(query)
                .sort({ postedAt: -1 })
                .skip(skip)
                .limit(limit);
            return { posts, total };
        }
        catch (error) {
            console.error('Error finding posts:', error);
            throw error;
        }
    }
    async findByUserId(userId, platform, page = 1, limit = 20) {
        try {
            const query = { userId: new mongoose_1.default.Types.ObjectId(userId) };
            if (platform) {
                query.platform = platform;
            }
            const total = await socialPost_js_1.default.countDocuments(query);
            const posts = await socialPost_js_1.default.find(query)
                .sort({ postedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
            return { posts, total };
        }
        catch (error) {
            console.error(`Error finding posts for user ${userId}:`, error);
            throw error;
        }
    }
    async create(postData) {
        try {
            // Handle userId as string or ObjectId
            if (postData.userId && typeof postData.userId === 'string') {
                postData.userId = new mongoose_1.default.Types.ObjectId(postData.userId);
            }
            const newPost = new socialPost_js_1.default(postData);
            return await newPost.save();
        }
        catch (error) {
            console.error('Error creating social post:', error);
            throw error;
        }
    }
    async update(id, updateData) {
        try {
            // Remove fields that should not be updated
            const { _id, userId, platformPostId, platform, ...safeUpdateData } = updateData;
            return await socialPost_js_1.default.findByIdAndUpdate(id, { $set: safeUpdateData }, { new: true });
        }
        catch (error) {
            console.error(`Error updating post ${id}:`, error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await socialPost_js_1.default.deleteOne({ _id: id });
            return result.deletedCount > 0;
        }
        catch (error) {
            console.error(`Error deleting post ${id}:`, error);
            throw error;
        }
    }
    buildQuery(filters) {
        const query = {};
        if (filters.userId) {
            query.userId = typeof filters.userId === 'string'
                ? new mongoose_1.default.Types.ObjectId(filters.userId)
                : filters.userId;
        }
        // Handle other common filters
        if (filters.platform)
            query.platform = filters.platform;
        if (filters.platformPostId)
            query.platformPostId = filters.platformPostId;
        // Handle text search in title and content
        if (filters.title || filters.content) {
            const searchTerms = [];
            if (filters.title)
                searchTerms.push({ title: { $regex: filters.title, $options: 'i' } });
            if (filters.content)
                searchTerms.push({ content: { $regex: filters.content, $options: 'i' } });
            if (searchTerms.length === 1) {
                Object.assign(query, searchTerms[0]);
            }
            else if (searchTerms.length > 1) {
                query.$or = searchTerms;
            }
        }
        return query;
    }
    async findFeedPosts(filters = {}) {
        try {
            const query = {};
            // Filter by user if specified (for user profiles)
            if (filters.userId) {
                query.userId = new mongoose_1.default.Types.ObjectId(filters.userId);
            }
            // Filter by platforms if specified
            if (filters.sources && filters.sources.length > 0) {
                query.platform = { $in: filters.sources };
            }
            // Set up sorting
            const sortOptions = {};
            if (filters.sortBy === 'popular') {
                sortOptions.likes = -1; // Sort by most likes
            }
            else {
                // Default to most recent
                sortOptions.postedAt = -1;
            }
            // Set up pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const skip = (page - 1) * limit;
            // Execute query
            const posts = await socialPost_js_1.default.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);
            return posts;
        }
        catch (error) {
            console.error('Error in findFeedPosts:', error);
            throw error;
        }
    }
    async findPostsByIds(postIds) {
        return await socialPost_js_1.default.find({
            _id: { $in: postIds }
        });
    }
}
exports.SocialPostRepository = SocialPostRepository;
// Export a singleton instance
exports.default = new SocialPostRepository();
