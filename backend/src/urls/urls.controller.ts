import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUrlDto: CreateUrlDto, @Req() req) {
    return this.urlsService.create(createUrlDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req) {
    return this.urlsService.findAll(req.user.userId);
  }

  @Get(':shortCode')
async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
  const url = await this.urlsService.findByShortCode(shortCode);
  await this.urlsService.incrementClicks(url.id as unknown as string);
  res.redirect(url.originalUrl);
}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    await this.urlsService.delete(id, req.user.userId);
    return { message: 'URL deleted successfully' };
  }
}