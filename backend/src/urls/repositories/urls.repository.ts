import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url as UrlEntity } from '../../common/interfaces/entities/url.entity';
import { Url, UrlDocument } from '../schemas/url.schema';
import { IRepository } from '../../common/interfaces/repository.interface';

@Injectable()
export class UrlsRepository implements IRepository<UrlEntity> {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async findAll(): Promise<UrlEntity[]> {
    const urls = await this.urlModel.find().exec();
    return urls.map(url => this.mapToEntity(url));
  }

  async findByOwner(ownerId: string): Promise<UrlEntity[]> {
    const urls = await this.urlModel.find({ owner: ownerId }).exec();
    return urls.map(url => this.mapToEntity(url));
  }

  async findById(id: string): Promise<UrlEntity | null> {
    const url = await this.urlModel.findById(id).exec();
    return url ? this.mapToEntity(url) : null;
  }

  async findByShortCode(shortCode: string): Promise<UrlEntity | null> {
    const url = await this.urlModel.findOne({ shortCode }).exec();
    return url ? this.mapToEntity(url) : null;
  }

  async create(createUrlData: Partial<UrlEntity>): Promise<UrlEntity> {
    const createdUrl = new this.urlModel(createUrlData);
    const savedUrl = await createdUrl.save();
    return this.mapToEntity(savedUrl);
  }

  async update(id: string, urlData: Partial<UrlEntity>): Promise<UrlEntity | null> {
    const updatedUrl = await this.urlModel
      .findByIdAndUpdate(id, urlData, { new: true })
      .exec();
    return updatedUrl ? this.mapToEntity(updatedUrl) : null;
  }

  async incrementClicks(id: string): Promise<UrlEntity | null> {
    const updatedUrl = await this.urlModel
      .findByIdAndUpdate(id, { $inc: { clicks: 1 } }, { new: true })
      .exec();
    return updatedUrl ? this.mapToEntity(updatedUrl) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.urlModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  private mapToEntity(document: UrlDocument): UrlEntity {
    const url = document.toObject();
    return {
      id: url._id.toString(),
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      owner: url.owner.toString(),
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }
}