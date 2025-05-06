// src/repositories/socialPostRepository.ts
import mongoose, { Types } from 'mongoose';
import SocialPost, { ISocialPost } from '../models/socialPost.js';
import { ISocialPostRepository } from '../interfaces/IRepositories/ISocialPostRepository.js';
import { FeedFilters } from '../types/socialPlatforms.js';



export class SocialPostRepository implements ISocialPostRepository {
  async findById(id: string): Promise<ISocialPost | null> {
    try {
      return await SocialPost.findById(id);
    } catch (error) {
      console.error(`Error finding post by ID ${id}:`, error);
      throw error;
    }
  }

  async findByPlatformId(
    userId: string | Types.ObjectId, 
    platform: string, 
    platformPostId: string
  ): Promise<ISocialPost | null> {
    try {
      return await SocialPost.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        platform,
        platformPostId
      });
    } catch (error) {
      console.error(`Error finding post by platform ID ${platformPostId}:`, error);
      throw error;
    }
  }

    
  async findAll(
    filters: Partial<ISocialPost> = {}, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ posts: ISocialPost[], total: number }> {
    try {
      const query = this.buildQuery(filters);
      const skip = (page - 1) * limit;
      
      const total = await SocialPost.countDocuments(query);
      const posts = await SocialPost.find(query)
        .sort({ postedAt: -1 })
        .skip(skip)
        .limit(limit);
      
      return { posts, total };
    } catch (error) {
      console.error('Error finding posts:', error);
      throw error;
    }
  }
  async findByUserId(
    userId: string, 
    platform?: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ posts: ISocialPost[], total: number }> {
    try {
      const query: any = { userId: new mongoose.Types.ObjectId(userId) };
      
      if (platform) {
        query.platform = platform;
      }
      
      const total = await SocialPost.countDocuments(query);
      const posts = await SocialPost.find(query)
        .sort({ postedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      
      return { posts, total };
    } catch (error) {
      console.error(`Error finding posts for user ${userId}:`, error);
      throw error;
    }
  }

  async create(postData: Partial<ISocialPost>): Promise<ISocialPost> {
    try {
      // Handle userId as string or ObjectId
      if (postData.userId && typeof postData.userId === 'string') {
        postData.userId = new mongoose.Types.ObjectId(postData.userId);
      }
      
      const newPost = new SocialPost(postData);
      return await newPost.save();
    } catch (error) {
      console.error('Error creating social post:', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<ISocialPost>): Promise<ISocialPost | null> {
    try {
      // Remove fields that should not be updated
      const { _id, userId, platformPostId, platform, ...safeUpdateData } = updateData;
      
      return await SocialPost.findByIdAndUpdate(
        id,
        { $set: safeUpdateData },
        { new: true }
      );
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await SocialPost.deleteOne({ _id: id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }

  private buildQuery(filters: Partial<ISocialPost>): any {
    const query: any = {};
    
    if (filters.userId) {
      query.userId = typeof filters.userId === 'string' 
        ? new mongoose.Types.ObjectId(filters.userId)
        : filters.userId;
    }
    
    // Handle other common filters
    if (filters.platform) query.platform = filters.platform;
    if (filters.platformPostId) query.platformPostId = filters.platformPostId;
    
    // Handle text search in title and content
    if (filters.title || filters.content) {
      const searchTerms = [];
      if (filters.title) searchTerms.push({ title: { $regex: filters.title, $options: 'i' } });
      if (filters.content) searchTerms.push({ content: { $regex: filters.content, $options: 'i' } });
      
      if (searchTerms.length === 1) {
        Object.assign(query, searchTerms[0]);
      } else if (searchTerms.length > 1) {
        query.$or = searchTerms;
      }
    }
    
    return query;
  }

  async findFeedPosts(filters: FeedFilters = {}): Promise<ISocialPost[]> {
    try {
      const query: any = {};
      
      // Filter by user if specified (for user profiles)
      if (filters.userId) {
        query.userId = new mongoose.Types.ObjectId(filters.userId);
      }
      
      // Filter by platforms if specified
      if (filters.sources && filters.sources.length > 0) {
        query.platform = { $in: filters.sources };
      }
      
      // Set up sorting
      const sortOptions: any = {};
      if (filters.sortBy === 'popular') {
        sortOptions.likes = -1; // Sort by most likes
      } else {
        // Default to most recent
        sortOptions.postedAt = -1;
      }
      
      // Set up pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const skip = (page - 1) * limit;
      
      // Execute query
      const posts = await SocialPost.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
      
      return posts;
    } catch (error) {
      console.error('Error in findFeedPosts:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new SocialPostRepository();