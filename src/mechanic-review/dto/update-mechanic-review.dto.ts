import { PartialType } from '@nestjs/swagger';
import { CreateMechanicReviewDto } from './create-mechanic-review.dto';

export class UpdateMechanicReviewDto extends PartialType(CreateMechanicReviewDto) {}
