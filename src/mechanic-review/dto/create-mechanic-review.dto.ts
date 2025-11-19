// mechanic-review/dto/create-mechanic-review.dto.ts
import { IsUUID, IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class CreateMechanicReviewDto {
  @IsUUID()
  mechanic_id: string;

  @IsUUID()
  customer_id: string;

  @IsOptional()
  @IsUUID()
  appointment_id?: string;

  @IsInt()
  @Min(1)
  @Max(10)
  rating: number; // 1–10

  @IsOptional()
  @IsString()
  comment?: string;
}
