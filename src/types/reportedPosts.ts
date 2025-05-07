import { SocialPlatform } from "../models/socialPost";

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

export interface SocialPost {
  _id: string;
  platform: SocialPlatform;
  title: string;
  content: string;
  author: {
    name: string;
    username?: string;
  };
  mediaUrls: string[];
  postedAt: string;
}

export interface ReportedPost {
  _id: string;
  reportedBy: User;
  reportedUser: User;
  postId: SocialPost;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}