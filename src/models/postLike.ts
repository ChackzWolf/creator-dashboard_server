import { Schema, Document, Types, model } from 'mongoose';

// 1. Interface
export interface IPostLike extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema
const PostLikeSchema = new Schema<IPostLike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'SocialPost',
      required: true,
    },
  },
  { timestamps: true }
);

// 3. Indexes
PostLikeSchema.index({ userId: 1, postId: 1 }, { unique: true });
PostLikeSchema.index({ postId: 1 });

// 4. Export
const PostLikeModel = model<IPostLike>('PostLike', PostLikeSchema);
export default PostLikeModel;
