import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Length,
} from 'class-validator';
import { MechanicStatus } from '../entities/mechanic.entity';
import { Type } from 'class-transformer';

export class CreateMechanicDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  last_name: string;

  @IsDate()
  @Type(() => Date)
  birth_date: Date;

  @IsEmail()
  @Length(3, 120)
  email: string;

  @IsOptional()
  @IsString()
  specialties?: string; // CSV (lo parsea el backend a array si querés)

  @IsOptional()
  @IsEnum(MechanicStatus)
  status?: MechanicStatus;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  commission_percentage?: number; // ej: 30 => 30%

  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  password: string;
}
