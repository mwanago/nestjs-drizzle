import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';
import { AreaDto } from './dto/area.dto';

@Injectable()
export class AreasService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getAll() {
    return this.drizzleService.db.select().from(databaseSchema.areas);
  }

  async getById(areaId: number) {
    const areas = await this.drizzleService.db
      .select()
      .from(databaseSchema.areas)
      .where(eq(databaseSchema.areas.id, areaId));
    const area = areas.pop();
    if (!area) {
      throw new NotFoundException();
    }
    return area;
  }

  async create(area: AreaDto) {
    const createdAreas = await this.drizzleService.db
      .insert(databaseSchema.areas)
      .values({
        name: area.name,
        polygon: [
          [
            [-73.981898, 40.768094], // Northwest corner
            [-73.958094, 40.800621], // Northeast corner
            [-73.949282, 40.796853], // Southeast corner
            [-73.973057, 40.764356], // Southwest corner
            [-73.981898, 40.768094], // Closing the polygon
          ],
        ],
      })
      .returning();

    return createdAreas.pop();
  }
}
