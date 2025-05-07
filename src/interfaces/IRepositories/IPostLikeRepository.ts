import { Types } from "mongoose";

export interface IPostLikeRepository {
    toggleLike(postId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<{ liked: boolean }>
    isLikedByUser(userId: Types.ObjectId|string, postId: Types.ObjectId|string): Promise<boolean>
    countLikes(postId: Types.ObjectId| string): Promise<number>
}