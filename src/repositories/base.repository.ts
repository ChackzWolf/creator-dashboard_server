import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return await entity.save() as T;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id) as T | null;
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter) as T | null;
  }

  async find(filter: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(filter) as T[];
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ) as T | null;
  }

  async updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>, options: QueryOptions = { new: true }): Promise<T | null> {
    return await this.model.findOneAndUpdate(
      filter,
      data,
      options
    ) as T | null;
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id) as T | null;
  }

  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    const result = await this.model.findOneAndDelete(filter);
    return result as unknown as T | null;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}