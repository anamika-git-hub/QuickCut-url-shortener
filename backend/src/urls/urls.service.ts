import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { Url, UrlDocument } from './schemas/url.schema';
import { CreateUrlDto } from './dto/create-user.dto';

@Injectable()
export class UrlsService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async create(createUrlDto: CreateUrlDto, userId: string): Promise<Url> {
    const shortCode = randomBytes(6).toString('base64url').substring(0, 8);
    
    const newUrl = new this.urlModel({
      originalUrl: createUrlDto.originalUrl,
      shortCode,
      owner: userId,
    });
    
    return newUrl.save();
  }

  async findAll(userId: string): Promise<Url[]> {
    return this.urlModel.find({ owner: userId }).exec();
  }

  async findByShortCode(shortCode: string): Promise<UrlDocument> {
    const url = await this.urlModel.findOne({ shortCode }).exec();
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url;
  }   

  async incrementClicks(urlId: string): Promise<void> {
    await this.urlModel.findByIdAndUpdate(urlId, { $inc: { clicks: 1 } }).exec();
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.urlModel.deleteOne({ _id: id, owner: userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('URL not found or you do not have permission to delete it');
    }
  }
}