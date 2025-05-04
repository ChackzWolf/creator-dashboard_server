// src/repositories/user.repository.ts
import { BaseRepository } from './base.repository';
import User, { UserDocument } from '../models/user';
import { IUserRepository } from '../interfaces/IRepositories/IUserRepository';

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

    async createUser (username:string, email:string, password:string):Promise<UserDocument | null>{
        return this.create({
            username,
            email,
            password,
        });
    }
}

export const userRepository = new UserRepository();