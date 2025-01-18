import { Module } from '@nestjs/common';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';

@Module({
  imports: [],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
