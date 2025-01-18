import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreaDto } from './dto/area.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  getAll() {
    return this.areasService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.areasService.getById(id);
  }

  @Post()
  create(@Body() area: AreaDto) {
    return this.areasService.create(area);
  }
}
