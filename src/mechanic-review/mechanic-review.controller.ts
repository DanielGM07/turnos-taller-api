// mechanic-review/mechanic-review.controller.ts
import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MechanicReviewService } from './mechanic-review.service';
import { CreateMechanicReviewDto } from './dto/create-mechanic-review.dto';
import { UpdateMechanicReviewDto } from './dto/update-mechanic-review.dto';

@Controller('mechanic-reviews')
export class MechanicReviewController {
  constructor(private readonly service: MechanicReviewService) {}

  @Post() create(@Body() dto: CreateMechanicReviewDto) {
    return this.service.create(dto);
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateMechanicReviewDto,
  ) {
    return this.service.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
