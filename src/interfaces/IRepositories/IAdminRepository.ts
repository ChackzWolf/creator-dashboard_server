import { IAdmin } from "../../models/admin";

export interface IAdminRepository {
    findByEmail(email: string): Promise<IAdmin | null>
    findOne() : Promise<IAdmin | null>
}