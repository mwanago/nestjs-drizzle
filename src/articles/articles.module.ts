import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';

@Module({
  imports: [],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
