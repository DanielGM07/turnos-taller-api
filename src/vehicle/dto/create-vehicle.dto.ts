import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateVehicleDto {
  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  license_plate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  brand: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  model: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;
}
