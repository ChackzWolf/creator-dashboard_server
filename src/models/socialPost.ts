import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialPost extends Document {
  userId: mongoose.Types.ObjectId;
  platform: string; // 'reddit', 'twitter', etc.
  platformPostId: string; // The ID of the post on the original platform
  title: string; // For Reddit, empty for Twitter
  content: string; // Post text
  mediaUrls: string[]; // URLs of any media (images, videos)
  platformUrl: string; // Original URL on the platform
  postedAt: Date; // When it was posted on the platform
  platformData: object; // Platform-specific metadata
  createdAt: Date; // When it was added to your database
  updatedAt: Date;
}

const SocialPostSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    platform: { 
      type: String, 
      required: true, 
      enum: ['reddit', 'twitter'] // Add more as needed
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
  },
  { 
    timestamps: true 
  }
);

// Compound index to prevent duplicate posts
SocialPostSchema.index({ userId: 1, platform: 1, platformPostId: 1 }, { unique: true });

export default mongoose.model<ISocialPost>('SocialPost', SocialPostSchema);