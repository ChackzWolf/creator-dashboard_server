import { UserDocument } from "../../models/user"

export interface IUserRepository {
    findByEmail(email: string): Promise<UserDocument | null>
    findByUsername(username: string): Promise<UserDocument | null>
    findByEmailOrUsername(email: string, username: string): Promise<UserDocument | null>
    findUserById(id:string):Promise<UserDocument | null>
    createUser (username:string, email:string, password:string): Promise<UserDocument | null>
}