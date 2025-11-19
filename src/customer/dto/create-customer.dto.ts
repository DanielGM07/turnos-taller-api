import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Length,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dni: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  last_name: string;

  @IsDateString()
  birth_date: string; // YYYY-MM-DD

  @IsEmail()
  @Length(3, 120)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  password: string;
}
