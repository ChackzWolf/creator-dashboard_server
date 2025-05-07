// src/repositories/user.repository.ts
import { BaseRepository } from './base.repository.js';
import User, { UserDocument } from '../models/user.js';
import { IUserRepository } from '../interfaces/IRepositories/IUserRepository.js';
import { UserRole } from '../types/userRoles.js';
import { Types } from 'mongoose';
import { IUser } from '../types/user.js';

export class UserRepository extends BaseRepository<UserDocument> implements IUserRepository{
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.findOne({ email });
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return this.findOne({ username });
    }

    async findByEmailOrUsername(email: string, username: string): Promise<UserDocument | null> {
        return this.findOne({ $or: [{ email }, { username }] });
    }

    async findUserById(id:string):Promise<UserDocument | null>{
        return this.findById(id)
    }

    async createUser(username: string, email: string, password: string): Promise<UserDocument | null> {
        console.log('creating user');
        try {
          const createdUser = await this.create({ username, email, password, role: UserRole.User });
          console.log('user created in repo:', createdUser);
          return createdUser;
        } catch (err) {
          console.error('Error in createUser:', err);
          return null;
        }
      }
      async toggleSavePost(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<IUser | null> {
        const user = await this.findById(userId.toString());
        if (!user) return null;
    
        const objectPostId = new Types.ObjectId(postId);
        const alreadySaved = user.savedPosts.some(savedId => savedId.equals(objectPostId));
    
        const updateOp = alreadySaved
          ? { $pull: { savedPosts: objectPostId } }
          : { $addToSet: { savedPosts: objectPostId } };
    
        return await this.update(userId.toString(), updateOp);
      }
}

export const userRepository = new UserRepository();