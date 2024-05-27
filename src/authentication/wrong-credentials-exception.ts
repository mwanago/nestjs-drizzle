import { UnauthorizedException } from '@nestjs/common';

export class WrongCredentialsException extends UnauthorizedException {
  constructor() {
    super('Wrong credentials provided');
  }
}
