"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// 2. Schema
const PostLikeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'SocialPost',
        required: true,
    },
}, { timestamps: true });
// 3. Indexes
PostLikeSchema.index({ userId: 1, postId: 1 }, { unique: true });
PostLikeSchema.index({ postId: 1 });
// 4. Export
const PostLikeModel = (0, mongoose_1.model)('PostLike', PostLikeSchema);
exports.default = PostLikeModel;
