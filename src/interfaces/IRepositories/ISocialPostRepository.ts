import { Types } from "mongoose";
import { ISocialPost } from "../../models/socialPost.js";
import { FeedFilters } from "../../types/socialPlatforms.js";

export interface ISocialPostRepository {
  findById(id: string): Promise<ISocialPost | null>;
  findByPlatformId(userId: string | Types.ObjectId, platform: string, platformPostId: string): Promise<ISocialPost | null>;
  findAll(filters?: Partial<ISocialPost>, page?: number, limit?: number): Promise<{ posts: ISocialPost[], total: number }>;
  findByUserId(userId: string, platform?: string, page?: number, limit?: number): Promise<{ posts: ISocialPost[], total: number }>;
  create(postData: Partial<ISocialPost>): Promise<ISocialPost>;
  update(id: string, updateData: Partial<ISocialPost>): Promise<ISocialPost | null>;
  delete(id: string): Promise<boolean>;
  findFeedPosts(filters: FeedFilters): Promise<ISocialPost[]
  > 
}