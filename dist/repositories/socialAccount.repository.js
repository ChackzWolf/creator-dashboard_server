"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAccountRepository = void 0;
const socialAccounts_js_1 = __importDefault(require("../models/socialAccounts.js"));
const mongoose_1 = require("mongoose");
class SocialAccountRepository {
    async create(data) {
        const account = new socialAccounts_js_1.default(data);
        return await account.save();
    }
    async findById(id) {
        return await socialAccounts_js_1.default.findById(id).exec();
    }
    async findByUserIdAndPlatform(userId, platform) {
        const objectUserId = new mongoose_1.Types.ObjectId(userId);
        return await socialAccounts_js_1.default.findOne({ userId: objectUserId, platform }).exec();
    }
    async updateByUserId(userId, data) {
        const objectUserId = new mongoose_1.Types.ObjectId(userId);
        return await socialAccounts_js_1.default.findByIdAndUpdate({ userId: objectUserId }, data, { new: true }).exec();
    }
    async deleteById(id) {
        return await socialAccounts_js_1.default.findByIdAndDelete(id).exec();
    }
    async listByUserId(userId) {
        const objectUserId = new mongoose_1.Types.ObjectId(userId);
        return await socialAccounts_js_1.default.find({ userId: objectUserId }).exec();
    }
}
exports.SocialAccountRepository = SocialAccountRepository;
exports.default = new SocialAccountRepository();
