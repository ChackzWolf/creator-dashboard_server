import { ISocialAccount } from "../../models/socialAccounts.js";
import { FeedItem, ISocialPost } from "../../models/socialPost.js";
import { FeedFilters, RedditPostData } from "../../types/socialPlatforms.js";

export interface ISocialAccountService {
    addSocialAccount(data: Partial<ISocialAccount>):Promise<{message:string, data:ISocialAccount}>
    getSocialAccount(userId: string, socialPlatform: string):Promise<{data: ISocialAccount, message:string}> 
    updateSocialAccount(userId: string, socialPlatform: string, data: { accessToken: string, tokenExpiry: Date }) : Promise<{message:string, data: ISocialAccount}>
    refreshRedditToken(refreshToken: string): Promise<any>
    getLinkedAccountsByUserId(userId: string): Promise<ISocialAccount[]>
    getRedditUserPosts(userId:string):Promise<{data:any, message: string}>
    createRedditPost(postData: RedditPostData): Promise<ISocialPost>
    getFeed(filters: FeedFilters,myUserId:string): Promise<FeedItem[]>
    toggleLikes(postId:string, userId:string): Promise<{liked:boolean}>
    fetchSavedPosts(userId:string):Promise<FeedItem[]>
    fetchPostById(id: string):Promise<FeedItem>
}