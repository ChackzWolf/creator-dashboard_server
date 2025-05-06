import { UserDocument } from "../../models/user.js";

export interface IUserService {
    getUserById(id: string):Promise<UserDocument>
}