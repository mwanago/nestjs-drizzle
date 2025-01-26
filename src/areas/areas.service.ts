import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq, sql } from 'drizzle-orm';
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
        polygon: area.polygon,
      })
      .returning();

    return createdAreas.pop();
  }

  async areAreasOverlapping(firstAreaId: number, secondAreaId: number) {
    const queryResult = await this.drizzleService.db.execute(
      sql`
        SELECT ST_Intersects(
          (SELECT ${databaseSchema.areas.polygon} FROM ${databaseSchema.areas} WHERE id = ${firstAreaId}),
          (SELECT ${databaseSchema.areas.polygon} FROM ${databaseSchema.areas} WHERE id = ${secondAreaId})
        ) AS "areAreasOverlapping";
      `,
    );

    const areAreasOverlapping = queryResult.rows.pop()?.areAreasOverlapping;

    if (areAreasOverlapping === null) {
      throw new NotFoundException();
    }

    return areAreasOverlapping;
  }

  async doesAreaContainCoordinates(
    areaId: number,
    longitude: number,
    latitude: number,
  ) {
    const queryResult = await this.drizzleService.db.execute(
      sql`
        SELECT ST_Within(
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
          (SELECT ${databaseSchema.areas.polygon} FROM ${databaseSchema.areas} WHERE id = ${areaId})
        ) AS "doesAreaContainCoordinates";
      `,
    );

    const doesAreaContainCoordinates =
      queryResult.rows.pop()?.doesAreaContainCoordinates;

    if (doesAreaContainCoordinates === null) {
      throw new NotFoundException();
    }

    return doesAreaContainCoordinates;
  }
}
