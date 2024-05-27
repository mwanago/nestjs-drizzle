import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './user.dto';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';
import { isRecord } from '../utilities/isRecord';
import { PostgresErrorCode } from '../database/postgresErrorCode.enum';
import UserAlreadyExistsException from './userAlreadyExists.exception';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getByEmail(email: string) {
    const users = await this.drizzleService.db
      .select()
      .from(databaseSchema.users)
      .where(eq(databaseSchema.users.email, email));

    const user = users.pop();

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(id: number) {
    const users = await this.drizzleService.db
      .select()
      .from(databaseSchema.users)
      .where(eq(databaseSchema.users.id, id));

    const user = users.pop();

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(user: UserDto) {
    if (user.address) {
      return this.createWithAddress(user);
    }

    try {
      const createdUsers = await this.drizzleService.db
        .insert(databaseSchema.users)
        .values(user)
        .returning();

      return createdUsers.pop();
    } catch (error) {
      if (isRecord(error) && error.code === PostgresErrorCode.UniqueViolation) {
        throw new UserAlreadyExistsException(user.email);
      }
      throw error;
    }
  }

  async createWithAddress(user: UserDto) {
    return this.drizzleService.db.transaction(async (transaction) => {
      const createdAddresses = await transaction
        .insert(databaseSchema.addresses)
        .values(user.address)
        .returning();

      const createdAddress = createdAddresses.pop();

      try {
        const createdUsers = await transaction
          .insert(databaseSchema.users)
          .values({
            name: user.name,
            email: user.email,
            password: user.password,
            addressId: createdAddress.id,
          })
          .returning();
        return createdUsers.pop();
      } catch (error) {
        if (
          isRecord(error) &&
          error.code === PostgresErrorCode.UniqueViolation
        ) {
          throw new UserAlreadyExistsException(user.email);
        }
        throw error;
      }
    });
  }
}
