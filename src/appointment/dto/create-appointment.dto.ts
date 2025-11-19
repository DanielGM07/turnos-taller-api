import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  Matches,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  service_id: string;

  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @IsUUID()
  @IsNotEmpty()
  mechanic_id: string;

  @IsOptional()
  @IsUUID()
  vehicle_id?: string;

  @IsUUID()
  @IsNotEmpty()
  workshop_id: string;

  @IsDateString()
  scheduled_at: string; // ISO

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  // 👇 NUEVO: precio final del trabajo
  @IsOptional()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'final_price must be a valid decimal (e.g. "1500" o "1500.50")',
  })
  final_price?: string;

  // 👇 NUEVO: fecha en la que se completó el trabajo
  @IsOptional()
  @IsDateString()
  completed_at?: string;
}
