import { Types } from "mongoose"
import { ISocialAccount } from "../../models/socialAccounts"

export interface ISocialAccountRepository {
    create(data: Partial<ISocialAccount>): Promise<ISocialAccount>
    findById(id: string): Promise<ISocialAccount | null>
    findByUserIdAndPlatform(userId: Types.ObjectId, platform: string): Promise<ISocialAccount | null>
    updateById(id: string, data: Partial<ISocialAccount>): Promise<ISocialAccount | null>
    deleteById(id: string): Promise<ISocialAccount | null> 
    listByUserId(userId: Types.ObjectId): Promise<ISocialAccount[]>
}