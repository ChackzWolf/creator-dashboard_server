import { Response, Request } from "express";
import { IAdminService } from "../interfaces/IServices/IAdminService";
import { errorResponse, successResponse } from "../utils/response";
import { AppError } from "../utils/errors";
import { IReportService } from "../interfaces/IServices/IReportService";
import { userRepository } from "../repositories/user.repository";
import { IUserService } from "../interfaces/IServices/IUserService";

export class AdminController {
    adminService: IAdminService;
    userService: IUserService;
    reportService: IReportService;

    constructor(adminService: IAdminService,reportService: IReportService, userService:IUserService) {
        this.adminService = adminService;
        this.reportService=reportService;
        this.userService = userService;
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

    async updateReportStatus (req:Request, res:Response){
        try {
            console.log('started', req.body)
            const data = req.body;
            const response = await this.reportService.updateReportStatus(data)
            console.log(response, 'statuss')
            res.status(201).json(successResponse(response));
        } catch (error) {
            console.log('Unknown error occurred', error);
            res.status(400).json(errorResponse('An unexpected error occurred'));
        }
    }

    async getUserList(req: Request ,res:Response){
        try {
            const { search } = req.query;
            console.log(req.query, 'data//////////////////////////')
            const response = await this.userService.fetchUsers(search);
            res.status(200).json(successResponse(response));
        } catch (error) {
            res.status(400).json(errorResponse("Something went wrong."));

        }
    }

    async toggleBlockUser(req: Request, res: Response){
        try {
            console.log('reached here', req.body)
            const { userId } = req.body
            if(!userId){
                throw new AppError("UserId not found.")
            }
            const response = await this.userService.toggleBlockUser(userId as string);
            res.status(201).json(successResponse(response));
        } catch (error) {
            res.status(201).json(errorResponse("User ID not found"));
        }
    }
}