import { ISocialAccountRepository } from '../interfaces/IRepositories/ISocialAccountRepository';
import { ISocialAccount } from '../models/socialAccounts';
import SocialAccountModel from '../models/socialAccounts';
import { Types } from 'mongoose';

export class SocialAccountRepository implements ISocialAccountRepository{
  async create(data: Partial<ISocialAccount>): Promise<ISocialAccount> {
    const account = new SocialAccountModel(data);
    return await account.save();
  }

  async findById(id: string): Promise<ISocialAccount | null> {
    return await SocialAccountModel.findById(id).exec();
  }

  async findByUserIdAndPlatform(userId: Types.ObjectId, platform: string): Promise<ISocialAccount | null> {
    return await SocialAccountModel.findOne({ userId, platform }).exec();
  }

  async updateById(id: string, data: Partial<ISocialAccount>): Promise<ISocialAccount | null> {
    return await SocialAccountModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<ISocialAccount | null> {
    return await SocialAccountModel.findByIdAndDelete(id).exec();
  }

  async listByUserId(userId: Types.ObjectId): Promise<ISocialAccount[]> {
    return await SocialAccountModel.find({ userId }).exec();
  }
}

export default new SocialAccountRepository();
