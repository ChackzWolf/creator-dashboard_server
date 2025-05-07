import { ReportedPostDocument } from "../../models/reportedPosts";

export interface IReportRepository {
    findByPostId(postId: string): Promise<ReportedPostDocument[]>
    submitReport(data: ReportedPostDocument): Promise<ReportedPostDocument>
    findByStatus(status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'): Promise<ReportedPostDocument[]>
    updateStatus(id: string, status: 'pending' | 'reviewed' | 'resolved' | 'dismissed', adminNotes?: string):Promise<ReportedPostDocument | null>
    getReportedPostsWithDetails(): Promise<ReportedPostDocument[]>}