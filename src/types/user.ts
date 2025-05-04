export interface IUser {
    username: string;
    email: string;
    role: 'user' | 'admin';
    profileCompleted: boolean;
    profilePicture?: string;
    password: string;
  }

    
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthCredentials {
  username: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: {
      _id: string;
      username: string;
      email: string;
  };
  token: string;
}