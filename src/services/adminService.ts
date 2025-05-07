import { IAdminRepository } from "../interfaces/IRepositories/IAdminRepository"
import bcrypt from 'bcryptjs';
import { AppError } from "../utils/errors";
import { IAdmin } from "../models/admin";
import { IAdminService } from "../interfaces/IServices/IAdminService";
import { UserRole } from "../types/userRoles";
import { AdminAuthResponse } from "../types/user";
import { IJWT } from "../interfaces/IUtils/I.jwt";

export class AdminService implements IAdminService{
    adminRepo: IAdminRepository;
    jwt: IJWT
    
    constructor(adminResitory : IAdminRepository, jwt: IJWT){
        this.adminRepo = adminResitory 
        this.jwt = jwt

    }
    
    async login(data:{password:string, email:string}):Promise<AdminAuthResponse> {
        const {email, password} = data;
        console.log(data, 'data')
        const admin = await this.adminRepo.findByEmail(email);
        if(!admin) throw new AppError("Invalid credentials.", 402);
        console.log(password,'  /////  ', admin.password)

        const isMatch = await bcrypt.compare(password, admin.password);
console.log(2)
        if (!isMatch) throw new AppError('Invalid password', 402);
        console.log(3)
        return {
            admin: {
              _id:admin._id,
              name: admin.name,
              email: admin.email,
            },
            token: this.jwt.generateToken(admin._id.toString(), UserRole.Admin),
          };
    }


    async getAdminProfile():Promise<IAdmin | null>{
      const response = await this.adminRepo.findOne()
      return response
    }

    
}


