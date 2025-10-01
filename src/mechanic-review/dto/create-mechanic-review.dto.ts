// mechanic-review/dto/create-mechanic-review.dto.ts
import { IsUUID, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateMechanicReviewDto {
  @IsUUID() mechanic_id: string;
  @IsUUID() customer_id: string;
  @IsOptional() @IsUUID() appointment_id?: string;
  @IsInt() @Min(1) @Max(5) rating: number;
  @IsOptional() @IsString() comment?: string;
}
