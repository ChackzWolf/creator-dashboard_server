import { IAdmin } from "../../models/admin";
import { AdminAuthResponse } from "../../types/user";

export interface IAdminService {
    login(data: { password: string, email: string }): Promise<AdminAuthResponse>
    getAdminProfile():Promise<IAdmin | null>
}