export const SocialPlatform = {
    TWITTER : 'twitter',
    REDDIT: 'reddit'
}


export interface FeedFilters {
    userId?:string;
    sources?: string[];
    sortBy?: 'recent' | 'popular';
    page?: number;
    limit?: number;
  }
  

export interface RedditPostData {
    userId: string;
    platform: string; // Or use SocialPlatform enum if available
    platformPostId: string;
    title: string;
    author: {
      name: string;
      username: string;
      avatar: string | null;
    };
    content: string;
    mediaUrls: string[];
    platformUrl: string;
    postedAt: string; // ISO date string
    platformData: {
      subreddit: string;
      upvotes: number;
      numComments: number;
    };
    createdAt: Date;
  }