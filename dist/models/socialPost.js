"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialPlatform = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Add this to match your frontend enums
var SocialPlatform;
(function (SocialPlatform) {
    SocialPlatform["REDDIT"] = "reddit";
    SocialPlatform["TWITTER"] = "twitter";
    SocialPlatform["LINKEDIN"] = "linkedin";
})(SocialPlatform || (exports.SocialPlatform = SocialPlatform = {}));
// Your existing schema with additions
const SocialPostSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: Object.values(SocialPlatform)
    },
    platformPostId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    // Add author information
    author: {
        name: { type: String, required: true },
        avatar: { type: String },
        username: { type: String }
    },
    mediaUrls: [{
            type: String
        }],
    platformUrl: {
        type: String
    },
    postedAt: {
        type: Date
    },
    platformData: {
        type: Object
    },
    // Add engagement metrics
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
// Compound index to prevent duplicate posts
SocialPostSchema.index({ userId: 1, platform: 1, platformPostId: 1 }, { unique: true });
// Add this method to convert to your FeedItem interface
SocialPostSchema.methods.toFeedItem = function () {
    // Map media URLs to the format expected by FeedItem
    const media = this.mediaUrls.map((url) => {
        // Simple media type detection
        const isVideo = url.includes('.mp4') ||
            url.includes('.mov') ||
            url.includes('video');
        return {
            type: isVideo ? 'video' : 'image',
            url: url
        };
    });
    return {
        id: this._id.toString(),
        source: this.platform,
        sourceId: this.platformPostId,
        content: this.title ? `${this.title}\n\n${this.content}` : this.content,
        author: this.author,
        createdAt: this.postedAt.toISOString(),
        media: media.length > 0 ? media : undefined,
        likes: this.likes,
        comments: this.comments,
        shares: this.shares,
        isSaved: true // Since it's being retrieved, we assume it's saved
    };
};
// Helper method to create from Reddit data
SocialPostSchema.statics.fromRedditPost = function (userId, redditPost) {
    const media = [];
    // Add image URL if available
    if (redditPost.url &&
        (redditPost.url.endsWith('.jpg') ||
            redditPost.url.endsWith('.png') ||
            redditPost.url.endsWith('.gif'))) {
        media.push(redditPost.url);
    }
    // Add video URL if available
    if (redditPost.is_video && redditPost.media?.reddit_video?.fallback_url) {
        media.push(redditPost.media.reddit_video.fallback_url);
    }
    return {
        userId,
        platform: SocialPlatform.REDDIT,
        platformPostId: redditPost.id,
        title: redditPost.title || '',
        content: redditPost.selftext || '',
        author: {
            name: redditPost.author || '[deleted]',
            username: redditPost.author || '[deleted]',
            // Reddit doesn't include avatar in post data
            avatar: null
        },
        mediaUrls: media,
        platformUrl: `https://reddit.com${redditPost.permalink}`,
        postedAt: new Date(redditPost.created_utc * 1000),
        platformData: redditPost,
        likes: 0, // Start with 0 for your platform
        comments: 0, // Start with 0 for your platform
        shares: 0 // Start with 0 for your platform
    };
};
exports.default = mongoose_1.default.model('SocialPost', SocialPostSchema);
