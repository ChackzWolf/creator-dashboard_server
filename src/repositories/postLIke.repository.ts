import { Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import PostLikeModel, { IPostLike } from '../models/postLike';
import { IPostLikeRepository } from '../interfaces/IRepositories/IPostLikeRepository';

export class PostLikeRepository  extends BaseRepository<IPostLike>  implements IPostLikeRepository{
    constructor() {
      super(PostLikeModel);
    }
  
    async toggleLike(postId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<{ liked: boolean }> {
      const objectUserId = new Types.ObjectId(userId);
      const objectPostId = new Types.ObjectId(postId)
      const existing = await this.findOne({ userId, postId });
      if (existing) {
        await this.deleteOne({ userId: objectUserId, postId: objectPostId });
        return { liked: false };
      } else {
        await this.create({ userId: objectUserId, postId:objectPostId });
        return { liked: true };
      }
    }
  
    async isLikedByUser(userId: Types.ObjectId | string, postId: Types.ObjectId|string): Promise<boolean> {
      const objectUserId = new Types.ObjectId(userId);
      const objectPostId = new Types.ObjectId(postId)
      return !!(await this.findOne({ userId: objectUserId, postId:objectPostId }));
    }
  
    async countLikes(postId: Types.ObjectId| string): Promise<number> {
      const objectPostId = new Types.ObjectId(postId)
      return await this.count({ postId :objectPostId});
    }
  
    async getLikesPaginated(postId: Types.ObjectId, page = 1, limit = 10) {
      return await this.model
        .find({ postId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name username');
    }
  
    async removeAllLikesForPost(postId: Types.ObjectId) {
      return await this.model.deleteMany({ postId });
    }
  
    async removeAllLikesByUser(userId: Types.ObjectId) {
      return await this.model.deleteMany({ userId });
    }
  }
  