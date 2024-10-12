import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { InferSelectModel } from 'drizzle-orm';
import { databaseSchema } from '../database/database-schema';

describe('The UsersService', () => {
  let usersService: UsersService;
  let findFirstMock: jest.Mock;
  beforeEach(async () => {
    findFirstMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DrizzleService,
          useValue: {
            db: {
              query: {
                users: {
                  findFirst: findFirstMock,
                },
              },
            },
          },
        },
      ],
    }).compile();

    usersService = await module.get(UsersService);
  });
  describe('when the getById function is called', () => {
    describe('and the findFirst method returns the user', () => {
      let user: InferSelectModel<typeof databaseSchema.users>;
      beforeEach(() => {
        user = {
          id: 1,
          email: 'john@smith.com',
          name: 'John',
          password: 'strongPassword123',
        };
        findFirstMock.mockResolvedValue(user);
      });
      it('should return the user', async () => {
        const result = await usersService.getById(user.id);
        expect(result).toBe(user);
      });
    });
    describe('and the findFirst method does not return the user', () => {
      beforeEach(() => {
        findFirstMock.mockResolvedValue(undefined);
      });
      it('should throw the NotFoundException', async () => {
        return expect(async () => {
          await usersService.getById(1);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});
