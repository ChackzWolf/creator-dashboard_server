import mongoose, { Schema } from 'mongoose';

const PostLikeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'SocialPost',
    required: true
  }
}, { timestamps: true });

// Compound index for uniqueness and queries
PostLikeSchema.index({ userId: 1, postId: 1 }, { unique: true });
PostLikeSchema.index({ postId: 1 });

export default mongoose.model('PostLike', PostLikeSchema);