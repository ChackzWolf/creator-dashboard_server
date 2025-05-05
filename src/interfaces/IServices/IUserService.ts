import { UserDocument } from "../../models/user";

export interface IUserService {
    getUserById(id: string):Promise<UserDocument>
}