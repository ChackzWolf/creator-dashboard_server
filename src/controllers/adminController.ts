import { Response, Request } from "express";
import { IAdminService } from "../interfaces/IServices/IAdminService";
import { errorResponse, successResponse } from "../utils/response";
import { AppError } from "../utils/errors";

export class AdminController {
    adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this.adminService = adminService
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            console.log('reached login controller ', req.body)
            const response = await this.adminService.login(req.body.credentials);
            console.log(response)
            res.status(201).json(successResponse(response, "Admin login successful"));
        } catch (error) {
            if (error instanceof AppError) {
                const statusCode = error.statusCode;
                const message = error.message || 'An unexpected error occurred';
                console.log(`Handling AppError: ${message} (status: ${statusCode})`);
                res.status(statusCode).json(errorResponse(message));
            } else {
                console.log('Unknown error occurred', error);
                res.status(400).json(errorResponse('An unexpected error occurred'));
            }
        }
    } 

    async getProfile(_req:Request, res:Response){
        try {
           const  response = await this.adminService.getAdminProfile()
           res.status(200).json(successResponse(response))
        } catch (error) {
            console.log('Unknown error occurred', error);
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }
}