"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostLikeRepository = void 0;
const mongoose_1 = require("mongoose");
const base_repository_1 = require("./base.repository");
const postLike_1 = __importDefault(require("../models/postLike"));
class PostLikeRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(postLike_1.default);
    }
    async toggleLike(postId, userId) {
        const objectUserId = new mongoose_1.Types.ObjectId(userId);
        const objectPostId = new mongoose_1.Types.ObjectId(postId);
        const existing = await this.findOne({ userId, postId });
        if (existing) {
            await this.deleteOne({ userId: objectUserId, postId: objectPostId });
            return { liked: false };
        }
        else {
            await this.create({ userId: objectUserId, postId: objectPostId });
            return { liked: true };
        }
    }
    async isLikedByUser(userId, postId) {
        const objectUserId = new mongoose_1.Types.ObjectId(userId);
        const objectPostId = new mongoose_1.Types.ObjectId(postId);
        return !!(await this.findOne({ userId: objectUserId, postId: objectPostId }));
    }
    async countLikes(postId) {
        const objectPostId = new mongoose_1.Types.ObjectId(postId);
        return await this.count({ postId: objectPostId });
    }
    async getLikesPaginated(postId, page = 1, limit = 10) {
        return await this.model
            .find({ postId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'name username');
    }
    async removeAllLikesForPost(postId) {
        return await this.model.deleteMany({ postId });
    }
    async removeAllLikesByUser(userId) {
        return await this.model.deleteMany({ userId });
    }
}
exports.PostLikeRepository = PostLikeRepository;
