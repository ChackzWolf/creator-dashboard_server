// models/SocialAccount.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialAccount extends Document {
  userId: mongoose.Types.ObjectId;
  platform: string; // 'reddit', 'twitter', etc.
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  platformUsername: string;
  platformUserId: string; // userId/username on that platform
  profileData: object |null; // Store platform-specific profile data
  createdAt: Date;
  updatedAt: Date;
}

const SocialAccountSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    platform: { 
      type: String, 
      required: true, 
      enum: ['reddit', 'twitter'] // Add more platforms as needed
    },
    accessToken: { 
      type: String, 
      required: true 
    },
    refreshToken: { 
      type: String 
    },
    tokenExpiry: { 
      type: Date 
    },
    platformUserId: { 
      type: String 
    },
    platformUsername: {
      type: String
    },
    profileData: { 
      type: Object 
    },
  },
  { 
    timestamps: true 
  }
);

// Compound index to ensure a user can only connect once to each platform
SocialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });

export default mongoose.model<ISocialAccount>('SocialAccount', SocialAccountSchema);
