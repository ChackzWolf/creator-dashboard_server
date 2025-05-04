import { UserDocument } from "../../models/user";
import { AuthCredentials, AuthResponse, RegisterRequest } from "../../types/user";

export interface IAuthService{
    registerUser (userData: RegisterRequest): Promise<AuthResponse> 
    loginUser (credentials: AuthCredentials): Promise<AuthResponse>
    getUserById(id: string):Promise<UserDocument>
}