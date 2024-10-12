import { IsString, IsNotEmpty } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  content?: string;

  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;
}
