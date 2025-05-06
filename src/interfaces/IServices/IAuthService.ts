import { UserDocument } from "../../models/user.js"
import { AuthCredentials, AuthResponse, RegisterRequest } from "../../types/user.js"

export interface IAuthService{
    registerUser (userData: RegisterRequest): Promise<AuthResponse> 
    loginUser (credentials: AuthCredentials): Promise<AuthResponse>
    getUserById(id: string):Promise<UserDocument>
}