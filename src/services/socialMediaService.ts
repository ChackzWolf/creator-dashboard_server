import { ISocialAccountRepository } from "../interfaces/IRepositories/ISocialAccountRepository";
import { ISocialAccountService } from "../interfaces/IServices/ISocialMediaService";
import { ISocialAccount } from "../models/socialAccounts";

export class SocialAccountService implements ISocialAccountService {
    socialMediaRepo: ISocialAccountRepository

    constructor(socialMediaRepository: ISocialAccountRepository){
        this.socialMediaRepo = socialMediaRepository
    }
    async addSocialAccount(data: Partial<ISocialAccount>):Promise<{message:string, data:ISocialAccount}> {
          const existingAccount = await this.socialMediaRepo.findByUserIdAndPlatform(
            data.userId!,
            data.platform!
          );
      
          if (existingAccount) {
            return {
                message: 'Social account already exists',
                data: existingAccount,
              };
          }
      
          const response = await this.socialMediaRepo.create(data);
          return {
            message: 'Social account connected successfully.',
            data: response,
          };
      }
      
    
}