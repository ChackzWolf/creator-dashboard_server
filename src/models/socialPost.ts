import mongoose, { Schema, Document } from 'mongoose';


export interface FeedSource {
  id: string;
  name: 'twitter' | 'reddit' | 'linkedin';
  enabled: boolean;
}
export interface FeedItem {
  id: string;
  source: FeedSource['name'];
  sourceId: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  createdAt: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: number;
  comments: number;
  shares: number;
  isSaved: boolean;
  isLiked: boolean;
  platformData:any
  userId:string
}

// Add this to match your frontend enums
export enum SocialPlatform {
  REDDIT = 'reddit',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin'
}



// Your existing interface with small additions
export interface ISocialPost extends Document {
  userId: mongoose.Types.ObjectId;
  platform: string; // 'reddit', 'twitter', etc.
  platformPostId: string; // The ID of the post on the original platform
  title: string; // For Reddit, empty for Twitter
  content: string; // Post text
  
  // Author info (add this to match your FeedItem)
  author: {
    name: string;
    avatar?: string;
    username?: string;
  };
  
  mediaUrls: string[]; // URLs of any media (images, videos)
  platformUrl: string; // Original URL on the platform
  postedAt: Date; // When it was posted on the platform
  platformData: object; // Platform-specific metadata
  
  // Engagement metrics for your platform (add these)
  likes: number;
  comments: number;
  shares: number;
  
  createdAt: Date; // When it was added to your database
  updatedAt: Date;
}

// Your existing schema with additions
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
  },
  { 
    timestamps: true 
  }
);

// Compound index to prevent duplicate posts
SocialPostSchema.index({ userId: 1, platform: 1, platformPostId: 1 }, { unique: true });

// Add this method to convert to your FeedItem interface
SocialPostSchema.methods.toFeedItem = function(): FeedItem {
  // Map media URLs to the format expected by FeedItem
  const media = this.mediaUrls.map((url:string) => {
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
    source: this.platform as FeedSource['name'],
    sourceId: this.platformPostId,
    content: this.title ? `${this.title}\n\n${this.content}` : this.content,
    author: this.author,
    createdAt: this.postedAt.toISOString(),
    media: media.length > 0 ? media : undefined,
    likes: this.likes,
    comments: this.comments,
    shares: this.shares,
    isSaved: true ,
    isLiked: false,
    platformData: this.platformData,
    userId: this.userId.toString()
  };
};

// Helper method to create from Reddit data
SocialPostSchema.statics.fromRedditPost = function(userId: mongoose.Types.ObjectId, redditPost: any) {
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

export default mongoose.model<ISocialPost>('SocialPost', SocialPostSchema);