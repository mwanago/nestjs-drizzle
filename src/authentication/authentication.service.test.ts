import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { DrizzleService } from '../database/drizzle.service';
import { InferSelectModel } from 'drizzle-orm';
import { databaseSchema } from '../database/database-schema';
import { DatabaseError } from '../database/databse-error';
import { PostgresErrorCode } from '../database/postgres-error-code.enum';
import { UserAlreadyExistsException } from '../users/user-already-exists.exception';

jest.mock('bcrypt', () => ({
  hash: () => {
    return Promise.resolve('hashed-password');
  },
}));

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let drizzleInsertReturningMock: jest.Mock;
  let drizzleInsertValuesMock: jest.Mock;
  let signUpData: SignUpDto;
  beforeEach(async () => {
    drizzleInsertValuesMock = jest.fn().mockReturnThis();
    drizzleInsertReturningMock = jest.fn().mockResolvedValue([]);
    signUpData = {
      email: 'john@smith.com',
      name: 'John',
      password: 'strongPassword123',
      phoneNumber: '123456789',
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
        {
          provide: DrizzleService,
          useValue: {
            db: {
              insert: jest.fn().mockReturnThis(),
              values: drizzleInsertValuesMock,
              returning: drizzleInsertReturningMock,
            },
          },
        },
      ],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
      ],
    }).compile();

    authenticationService = await module.get(AuthenticationService);
  });
  describe('when the signUp function is called', () => {
    it('should insert the user using the Drizzle ORM', async () => {
      await authenticationService.signUp(signUpData);
      expect(drizzleInsertValuesMock).toHaveBeenCalledWith({
        ...signUpData,
        password: 'hashed-password',
      });
    });
  });
  describe('when the DrizzleService returns a valid user', () => {
    let createdUser: InferSelectModel<typeof databaseSchema.users>;
    beforeEach(() => {
      createdUser = {
        ...signUpData,
        id: 1,
      };
      drizzleInsertReturningMock.mockResolvedValue([createdUser]);
    });
    it('should return the user as well', async () => {
      const result = await authenticationService.signUp(signUpData);
      expect(result).toBe(createdUser);
    });
  });
  describe('when the DrizzleService throws the UniqueViolation error', () => {
    beforeEach(() => {
      const databaseError: DatabaseError = {
        code: PostgresErrorCode.UniqueViolation,
        table: 'users',
        detail: 'Key (email)=(john@smith.com) already exists.',
      };
      drizzleInsertReturningMock.mockImplementation(() => {
        throw databaseError;
      });
    });
    it('should throw the ConflictException', () => {
      return expect(async () => {
        await authenticationService.signUp(signUpData);
      }).rejects.toThrow(UserAlreadyExistsException);
    });
  });
});
