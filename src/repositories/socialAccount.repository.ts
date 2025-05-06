import { ISocialAccountRepository } from '../interfaces/IRepositories/ISocialAccountRepository.js';
import { ISocialAccount } from '../models/socialAccounts.js';
import SocialAccountModel from '../models/socialAccounts.js';
import { Types } from 'mongoose';

export class SocialAccountRepository implements ISocialAccountRepository{
  async create(data: Partial<ISocialAccount>): Promise<ISocialAccount> {
    const account = new SocialAccountModel(data);
    return await account.save();
  }

  async findById(id: string): Promise<ISocialAccount | null> {
    return await SocialAccountModel.findById(id).exec();
  }

  async findByUserIdAndPlatform(userId: string | Types.ObjectId, platform: string): Promise<ISocialAccount | null> {
    const objectUserId = new Types.ObjectId(userId)
    return await SocialAccountModel.findOne({ userId: objectUserId, platform }).exec();
  }

  async updateByUserId(userId: string, data: Partial<ISocialAccount>): Promise<ISocialAccount | null> {
    const objectUserId = new Types.ObjectId(userId)
    return await SocialAccountModel.findByIdAndUpdate({userId:objectUserId}, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<ISocialAccount | null> {
    return await SocialAccountModel.findByIdAndDelete(id).exec();
  }

  async listByUserId(userId: Types.ObjectId | string): Promise<ISocialAccount[]> {
    const objectUserId = new Types.ObjectId(userId)
    return await SocialAccountModel.find({ userId:objectUserId }).exec();
  }
}

export default new SocialAccountRepository();
