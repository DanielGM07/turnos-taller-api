// mechanic-review/dto/update-mechanic-review.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMechanicReviewDto } from './create-mechanic-review.dto';
import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateMechanicReviewDto extends PartialType(
  CreateMechanicReviewDto,
) {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number; // 1–10
}
