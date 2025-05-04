
import { AuthResponse, RegisterRequest, AuthCredentials } from '../types/user';
import { IAuthService } from '../interfaces/IServices/IAuthService';
import { UserDocument } from '../models/user';
import { IUserRepository } from '../interfaces/IRepositories/IUserRepository';
import {IJWT} from '../interfaces/IUtils/I.jwt'

export class AuthService implements IAuthService{
    
    jwt: IJWT
    userRepository : IUserRepository

    constructor(userRepository: IUserRepository, jwt:IJWT){
        this.userRepository = userRepository
        this.jwt = jwt
    }

    async registerUser (userData: RegisterRequest): Promise<AuthResponse> {
        const { username, email, password } = userData;

        // Check if user already exists
        const userExists = await this.userRepository.findByEmailOrUsername(email, username);
        if (userExists) {
            throw new Error('User already exists');
        }

        // Create user
        const user = await this.userRepository.createUser(username,email,password);

        if (!user) {
            throw new Error('Invalid user data');
        }

        // Return user data and token
        return {
            user: {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
            token: this.jwt.generateToken(user._id.toString()),
        };
    };


    async loginUser (credentials: AuthCredentials): Promise<AuthResponse>{
        const { email, password } = credentials;
    
        // Check for user email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
    
        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
    
        // Return user data and token
        return {
            user: {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
            token: this.jwt.generateToken(user._id.toString()),
        };
    };

    async getUserById(id: string):Promise<UserDocument> {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    };

}




