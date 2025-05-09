import { IReportRepository } from "../interfaces/IRepositories/IReportRepository";
import ReportedPostModel, { ReportedPostDocument } from "../models/reportedPosts";
import { BaseRepository } from "./base.repository";

export class ReportedPostRepository extends BaseRepository<ReportedPostDocument> implements IReportRepository {
  constructor() {
    super(ReportedPostModel);
  }

  async findByPostId(postId: string): Promise<ReportedPostDocument[]> {
    return this.model.find({ postId });
  }

  async submitReport(data: ReportedPostDocument): Promise<ReportedPostDocument>{
    return this.create(data)
  }

  async updateStatus(
    _id: string,
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed',
    adminNotes?: string
  ): Promise<ReportedPostDocument | null> {
    const update: any = { status };

    if (adminNotes) update.adminNotes = adminNotes;
  
    return this.update(_id, update); // ✅ use the full update object
  }

  async findByStatus(status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'): Promise<ReportedPostDocument[]> {
    return this.model.find({ status });
  }



  async getReportedPostsWithDetails(): Promise<ReportedPostDocument[]> {
    return this.model
      .find()
      .populate('reportedBy')
      .populate('reportedUser')
      .populate('postId');
  }
}

