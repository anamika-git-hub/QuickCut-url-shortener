import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { UrlsRepository } from './repositories/urls.repository';
import { Url, UrlSchema } from './schemas/url.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  providers: [UrlsService, UrlsRepository],
  controllers: [UrlsController],
})
export class UrlsModule {}