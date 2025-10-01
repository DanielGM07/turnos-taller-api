import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
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

  @IsOptional()
  @IsString()
  specialties?: string; // CSV (lo parsea el backend a array si querés)

  @IsOptional()
  @IsEnum(MechanicStatus)
  status?: MechanicStatus;
}
