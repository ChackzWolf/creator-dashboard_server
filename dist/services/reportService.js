"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
class ReportService {
    constructor(reportRepo) {
        this.reportRepo = reportRepo;
    }
    async submitReport(data) {
        const response = await this.reportRepo.submitReport(data);
        return response;
    }
    async fetchReports() {
        const response = await this.reportRepo.getReportedPostsWithDetails();
        return response;
    }
    async updateReportStatus(data) {
        const { reportId, status } = data;
        const response = await this.reportRepo.updateStatus(reportId, status);
        console.log(response, '///////////////');
        return response;
    }
}
exports.ReportService = ReportService;
