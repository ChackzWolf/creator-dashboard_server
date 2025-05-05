import { ISocialAccount } from "../../models/socialAccounts";

export interface ISocialAccountService {
    addSocialAccount(data: Partial<ISocialAccount>):Promise<{message:string, data:ISocialAccount}>
}