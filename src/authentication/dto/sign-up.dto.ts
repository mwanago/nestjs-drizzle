import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
