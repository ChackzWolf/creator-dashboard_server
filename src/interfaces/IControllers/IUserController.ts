import { AuthRequest } from "../../utils/middleware/authMiddleware.js";
import { Response } from "express";

export interface IUserController {
getCurrentUser(req: AuthRequest, res: Response):Promise<void>}