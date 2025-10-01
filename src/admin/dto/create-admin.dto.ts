import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Length,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  last_name: string;

  @IsEmail()
  @Length(3, 120)
  email: string;
}
