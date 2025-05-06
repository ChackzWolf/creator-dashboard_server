import { Types } from "mongoose"
import { ISocialAccount } from "../../models/socialAccounts.js"

export interface ISocialAccountRepository {
    create(data: Partial<ISocialAccount>): Promise<ISocialAccount>
    findById(id: string): Promise<ISocialAccount | null>
    findByUserIdAndPlatform(userId: string | Types.ObjectId, platform: string): Promise<ISocialAccount | null>
    updateByUserId(userId: string, data: Partial<ISocialAccount>): Promise<ISocialAccount | null>
    deleteById(id: string): Promise<ISocialAccount | null> 
    listByUserId(userId: Types.ObjectId | string): Promise<ISocialAccount[]>
}