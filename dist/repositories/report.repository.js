"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportedPostRepository = void 0;
const reportedPosts_1 = __importDefault(require("../models/reportedPosts"));
const base_repository_1 = require("./base.repository");
class ReportedPostRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(reportedPosts_1.default);
    }
    async findByPostId(postId) {
        return this.model.find({ postId });
    }
    async submitReport(data) {
        return this.create(data);
    }
    async updateStatus(_id, status, adminNotes) {
        const update = { status };
        if (adminNotes)
            update.adminNotes = adminNotes;
        return this.update(_id, update); // ✅ use the full update object
    }
    async findByStatus(status) {
        return this.model.find({ status });
    }
    async getReportedPostsWithDetails() {
        return this.model
            .find()
            .populate('reportedBy')
            .populate('reportedUser')
            .populate('postId');
    }
}
exports.ReportedPostRepository = ReportedPostRepository;
