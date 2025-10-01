import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
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
}
