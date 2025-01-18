import {
  IsString,
  IsNotEmpty,
} from "class-validator";

export class AreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  coordinates: unknown;
}
