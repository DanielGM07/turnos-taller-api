import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class CreateServiceDto {
  @IsString() @IsNotEmpty() @MaxLength(120) name: string;
  @IsOptional() @IsString() description?: string;
  @IsNumberString() min_price: string;
  @IsNumberString() max_price: string;
}
