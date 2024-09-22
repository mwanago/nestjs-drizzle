import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

describe('The AuthenticationService', () => {
  let signUpData: SignUpDto;
  let authenticationService: AuthenticationService;
  beforeEach(async () => {
    signUpData = {
      email: 'john@smith.com',
      name: 'John',
      password: 'strongPassword123',
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockReturnValue(signUpData),
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
  describe('when calling the getCookieForLogOut method', () => {
    it('should return a correct string', () => {
      const result = authenticationService.getCookieForLogOut();
      expect(result).toBe('Authentication=; HttpOnly; Path=/; Max-Age=0');
    });
  });
  describe('when registering a new user', () => {
    describe('and when the usersService returns the new user', () => {
      it('should return the new user', async () => {
        const result = await authenticationService.signUp(signUpData);
        expect(result).toBe(signUpData);
      });
    });
  });
});
