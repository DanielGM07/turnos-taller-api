import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { WorkOrderStatus } from '../entities/work-order.entity';

export class CreateWorkOrderDto {
  @IsUUID()
  @IsNotEmpty()
  appointment_id: string;

  @IsUUID()
  @IsNotEmpty()
  mechanic_id: string;

  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;
}
