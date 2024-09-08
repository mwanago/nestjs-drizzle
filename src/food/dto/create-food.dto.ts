import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsIsoInterval } from './IsIsoInterval';

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsIsoInterval)
  expiryAfterOpening: string;
}
