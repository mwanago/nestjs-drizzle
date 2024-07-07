import { IsString, IsNotEmpty } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdateArticleDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @CanBeUndefined()
  paragraphs?: string[];

  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;
}
