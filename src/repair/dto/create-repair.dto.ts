import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
} from 'class-validator';
export class CreateRepairDto {
  @IsUUID()
  @IsNotEmpty()
  vehicle_id: string;

  @IsUUID()
  @IsNotEmpty()
  service_id: string;

  @IsOptional()
  @IsUUID()
  appointment_id?: string;

  @IsNumberString()
  final_price: string;
}
