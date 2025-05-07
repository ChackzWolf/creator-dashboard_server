import { FilterQuery } from "mongoose";
import { IAdminRepository } from "../interfaces/IRepositories/IAdminRepository";
import Admin,{ IAdmin } from "../models/admin";
import { BaseRepository } from "./base.repository";

export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository{
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.model.findOne({ email });
  }

  async findOne() : Promise<IAdmin | null> {
     return this.model.findOne()
  }
}
