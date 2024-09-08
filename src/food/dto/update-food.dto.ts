import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';
import { IsIsoInterval } from './IsIsoInterval';

export class UpdateFoodDto {
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsIsoInterval)
  @CanBeUndefined()
  expiryAfterOpening?: string;
}
