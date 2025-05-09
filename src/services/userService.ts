
import { AuthResponse, RegisterRequest, AuthCredentials, IUser } from '../types/user';
import { IAuthService } from '../interfaces/IServices/IAuthService';
import { UserDocument } from '../models/user';
import { IUserRepository } from '../interfaces/IRepositories/IUserRepository';
import {IJWT} from '../interfaces/IUtils/I.jwt'
import { AppError } from '../utils/errors';
import { UserRole } from '../types/userRoles';
import { IUserService } from '../interfaces/IServices/IUserService';
import { Types } from 'mongoose';
import { response } from 'express';

export class UserService implements IUserService
{
    
    userRepository : IUserRepository

    constructor(userRepository: IUserRepository){
        this.userRepository = userRepository
    }
  
    async getUserById(id: string):Promise<UserDocument> {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    };

    async savePostToUser (userId:string, postId:string):Promise<boolean>{
        const response = await this.userRepository.toggleSavePost(userId,postId)
        return response?.savedPosts.includes(new Types.ObjectId(postId)) || false
    }

    async toggleBlockUser(userId: string): Promise<Boolean>{
        const response = await this.userRepository.toggleBlock(userId)
        return response
    }

    async fetchUsers(search:any = null):Promise<UserDocument[] | null>{
        const users = await this.userRepository.getUsers(search)
        return users
    }
}




