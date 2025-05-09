import { Types } from "mongoose"
import { UserDocument } from "../../models/user.js"
import { IUser } from "../../types/user.js"

export interface IUserRepository {
    findByEmail(email: string): Promise<UserDocument | null>
    findByUsername(username: string): Promise<UserDocument | null>
    findByEmailOrUsername(email: string, username: string): Promise<UserDocument | null>
    findUserById(id:string):Promise<UserDocument | null>
    createUser (username:string, email:string, password:string): Promise<UserDocument | null>
    toggleSavePost(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<IUser | null>
    getUsers(filter:any): Promise<UserDocument[] | null>
}