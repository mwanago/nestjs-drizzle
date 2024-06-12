import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { DrizzleService } from '../database/drizzle.service';
import { databaseSchema } from '../database/database-schema';
import { eq } from 'drizzle-orm';
import { PostgresErrorCode } from '../database/postgres-error-code.enum';
import { UserAlreadyExistsException } from './user-already-exists.exception';
import { isDatabaseError } from '../database/databse-error';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getByEmail(email: string) {
    const user = await this.drizzleService.db.query.users.findFirst({
      with: {
        address: true,
      },
      where: eq(databaseSchema.users.email, email),
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(id: number) {
    const user = await this.drizzleService.db.query.users.findFirst({
      with: {
        address: true,
      },
      where: eq(databaseSchema.users.id, id),
    });

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
      if (
        isDatabaseError(error) &&
        error.code === PostgresErrorCode.UniqueViolation
      ) {
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
          isDatabaseError(error) &&
          error.code === PostgresErrorCode.UniqueViolation
        ) {
          throw new UserAlreadyExistsException(user.email);
        }
        throw error;
      }
    });
  }

  async delete(userId: number) {
    try {
      const deletedUsers = await this.drizzleService.db
        .delete(databaseSchema.users)
        .where(eq(databaseSchema.users.id, userId))
        .returning();
      if (deletedUsers.length === 0) {
        throw new NotFoundException();
      }
    } catch (error) {
      if (
        isDatabaseError(error) &&
        error.code === PostgresErrorCode.ForeignKeyViolation
      ) {
        throw new BadRequestException(
          'Can not remove a user that is an author of an article',
        );
      }
      throw error;
    }
  }

  deleteWithArticles(userId: number) {
    return this.drizzleService.db.transaction(async (transaction) => {
      await transaction
        .delete(databaseSchema.articles)
        .where(eq(databaseSchema.articles.authorId, userId));

      const deletedUsers = await transaction
        .delete(databaseSchema.users)
        .where(eq(databaseSchema.users.id, userId))
        .returning();

      if (deletedUsers.length === 0) {
        throw new NotFoundException();
      }
    });
  }
}
