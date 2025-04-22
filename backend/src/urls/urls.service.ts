import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlsRepository } from './repositories/urls.repository';
import { Url } from '../common/interfaces/entities/url.entity';

@Injectable()
export class UrlsService {
  constructor(private readonly urlsRepository: UrlsRepository) {}

  async create(createUrlDto: CreateUrlDto, userId: string): Promise<Url> {
    
    const shortCode = randomBytes(6).toString('base64url').substring(0, 8);
    
    return this.urlsRepository.create({
      originalUrl: createUrlDto.originalUrl,
      shortCode,
      owner: userId,
      clicks: 0,
    });
  }

  async findAll(userId: string): Promise<Url[]> {
    return this.urlsRepository.findByOwner(userId);
  }

  async findByShortCode(shortCode: string): Promise<Url> {
    const url = await this.urlsRepository.findByShortCode(shortCode);
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url;
  }

  async incrementClicks(urlId: string): Promise<void> {
    await this.urlsRepository.incrementClicks(urlId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const url = await this.urlsRepository.findById(id);
    
    if (!url || url.owner.toString() !== userId) {
      throw new NotFoundException('URL not found or you do not have permission to delete it');
    }
    
    const deleted = await this.urlsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Failed to delete URL');
    }
  }
}