import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MechanicReviewService } from './mechanic-review.service';
import { CreateMechanicReviewDto } from './dto/create-mechanic-review.dto';
import { UpdateMechanicReviewDto } from './dto/update-mechanic-review.dto';

@Controller('mechanic-reviews')
export class MechanicReviewController {
  constructor(private readonly service: MechanicReviewService) {}

  @Post()
  async create(@Body() dto: CreateMechanicReviewDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMechanicReviewDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }
}
