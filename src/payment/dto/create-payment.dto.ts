import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  Matches,
} from 'class-validator';
import { PaymentMethod } from '../../common/enums/payment-method.enum';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  appointment_id: string;

  // string decimal, luego en el service lo pasamos a number
  @IsOptional()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'amount_total must be a valid decimal (e.g. "1000" o "1000.50")',
  })
  amount_total?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
