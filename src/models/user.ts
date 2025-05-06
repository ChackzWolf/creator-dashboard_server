import mongoose, { Schema, Model, Document } from 'mongoose';
import { IUser } from '../types/user.js';
import bcrypt from 'bcryptjs';

import { Types } from 'mongoose';

export interface UserDocument extends IUser, Document {
  _id: Types.ObjectId; // ✅ Explicitly define _id
  comparePassword(candidatePassword: string): Promise<boolean>;
}


const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
    },
    redditRefreshToken: {
      type:String,
      required:false,
      default:''
    }
  },
  { 
    timestamps: true,
  }
);

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
export default User;
