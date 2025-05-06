"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        const entity = new this.model(data);
        return await entity.save();
    }
    async findById(id) {
        return await this.model.findById(id);
    }
    async findOne(filter) {
        return await this.model.findOne(filter);
    }
    async find(filter = {}) {
        return await this.model.find(filter);
    }
    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    async updateOne(filter, data, options = { new: true }) {
        return await this.model.findOneAndUpdate(filter, data, options);
    }
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
    async deleteOne(filter) {
        const result = await this.model.findOneAndDelete(filter);
        return result;
    }
    async count(filter = {}) {
        return await this.model.countDocuments(filter);
    }
}
exports.BaseRepository = BaseRepository;
