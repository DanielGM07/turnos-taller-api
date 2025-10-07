import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';

@Controller('mechanic')
export class MechanicController {
  constructor(private readonly service: MechanicService) {}

  @Post()
  async create(@Body() dto: CreateMechanicDto) {
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
  async update(@Param('id') id: string, @Body() dto: UpdateMechanicDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id);
  }

  // Endpoints opcionales para manejar relación N–N con talleres
  @Post(':mechanicId/workshops/:workshopId')
  async linkWorkshop(
    @Param('mechanicId') mechanicId: string,
    @Param('workshopId') workshopId: string,
  ) {
    return await this.service.linkWorkshop(mechanicId, workshopId);
  }

  @Delete(':mechanicId/workshops/:workshopId')
  async unlinkWorkshop(
    @Param('mechanicId') mechanicId: string,
    @Param('workshopId') workshopId: string,
  ) {
    return await this.service.unlinkWorkshop(mechanicId, workshopId);
  }
}
