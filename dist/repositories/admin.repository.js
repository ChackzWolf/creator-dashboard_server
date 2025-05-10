"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const admin_1 = __importDefault(require("../models/admin"));
const base_repository_1 = require("./base.repository");
class AdminRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(admin_1.default);
    }
    async findByEmail(email) {
        return this.model.findOne({ email });
    }
    async findOne() {
        return this.model.findOne();
    }
}
exports.AdminRepository = AdminRepository;
