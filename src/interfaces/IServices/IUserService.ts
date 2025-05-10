import { UserDocument } from "../../models/user.js";

export interface IUserService {
    getUserById(id: string):Promise<UserDocument>
    savePostToUser (userId:string, postId:string):Promise<boolean>
    fetchUsers(filter:any):Promise<UserDocument[] | null>
    toggleBlockUser(userId: string): Promise<Boolean>
}