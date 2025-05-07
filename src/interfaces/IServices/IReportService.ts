import { ReportedPostDocument } from "../../models/reportedPosts";

export interface IReportService {
    submitReport(data: ReportedPostDocument):Promise<ReportedPostDocument> 
    fetchReports():Promise<ReportedPostDocument[]>
}