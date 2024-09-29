import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { DrizzleService } from '../database/drizzle.service';

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
});
