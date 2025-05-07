import { IReportRepository } from "../interfaces/IRepositories/IReportRepository";
import { IReportService } from "../interfaces/IServices/IReportService";
import { ReportedPostDocument } from "../models/reportedPosts";

export class ReportService implements IReportService{
    reportRepo: IReportRepository

    constructor(reportRepo: IReportRepository) {
        this.reportRepo = reportRepo
    }

    async submitReport(data: ReportedPostDocument):Promise<ReportedPostDocument> {
        const response = await this.reportRepo.submitReport(data);
        return response;
    }

    async fetchReports():Promise<ReportedPostDocument[]>{
        const response = await this.reportRepo.getReportedPostsWithDetails()
        return response
    }
}
