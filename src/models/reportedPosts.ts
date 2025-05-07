import mongoose, { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface ReportedPostDocument extends Document {
  reportedBy: Types.ObjectId; // User who reported the post
  reportedUser: Types.ObjectId; // User who created the post
  postId: Types.ObjectId; // The post being reported
  reason: string; // Why the post was reported
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string; // Optional notes from admin review
  createdAt: Date;
  updatedAt: Date;
}

const ReportedPostSchema = new Schema(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'SocialPost',
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    },
    adminNotes: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model<ReportedPostDocument>('ReportedPost', ReportedPostSchema);