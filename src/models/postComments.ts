
import mongoose, { Schema } from 'mongoose';

const PostCommentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'SocialPost',
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Index for fast queries
PostCommentSchema.index({ postId: 1 });

export default mongoose.model('PostComment', PostCommentSchema);