
import { AuthResponse, RegisterRequest, AuthCredentials } from '../types/user.js';
import { IAuthService } from '../interfaces/IServices/IAuthService.js';
import { UserDocument } from '../models/user.js';
import { IUserRepository } from '../interfaces/IRepositories/IUserRepository.js';
import {IJWT} from '../interfaces/IUtils/I.jwt.js';
import { AppError } from '../utils/errors.js';
import { UserRole } from '../types/userRoles.js';

export class AuthService implements IAuthService{
    
    jwt: IJWT
    userRepository : IUserRepository

    constructor(userRepository: IUserRepository, jwt:IJWT){
        this.userRepository = userRepository
        this.jwt = jwt
    }

    async registerUser (userData: RegisterRequest): Promise<AuthResponse> {
        
            const { username, email, password } = userData;
            console.log(userData, 'fromt service register')
            // Check if user already exists
            const emailExists = await this.userRepository.findByEmail(email);
            if (emailExists) {
                console.log('Email already exists')
                throw new AppError('Email already exists',409);
            }
            const userNameExists = await this.userRepository.findByUsername(username);

            if (userNameExists) {
                console.log('User already exists')
                throw new AppError('Username already exists, try another one.',409);
            }
    
            // Create user
            const user = await this.userRepository.createUser(username,email,password);
            console.log(user, 'created user')
            if (!user) {
                throw new AppError('Invalid user data', 400);
            }
    
            // Return user data and token
            return {
                user: {
                    _id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                },
                token: this.jwt.generateToken(user._id.toString(), UserRole.User),
            };
            

    };


    async loginUser (credentials: AuthCredentials): Promise<AuthResponse>{
        const { email, password } = credentials;
    
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Invalid credentials',400);
        }
    
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new AppError('Invalid credentials',400);
        }
    
        return {
            user: {
                ...user,
                _id: user._id.toString(),                
            },
            token: this.jwt.generateToken(user._id.toString(), UserRole.User),
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




