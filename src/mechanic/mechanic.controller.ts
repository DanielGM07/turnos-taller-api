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

  @Post() create(@Body() dto: CreateMechanicDto) {
    return this.service.create(dto);
  }
  @Get() findAll() {
    return this.service.findAll();
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateMechanicDto,
  ) {
    return this.service.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // Endpoints opcionales para vincular/desvincular talleres (manejan la N–N implícita)
  @Post(':mechanicId/workshops/:workshopId')
  linkWorkshop(
    @Param('mechanicId') mechanicId: string,
    @Param('workshopId') workshopId: string,
  ) {
    return this.service.linkWorkshop(mechanicId, workshopId);
  }
  @Delete(':mechanicId/workshops/:workshopId')
  unlinkWorkshop(
    @Param('mechanicId') mechanicId: string,
    @Param('workshopId') workshopId: string,
  ) {
    return this.service.unlinkWorkshop(mechanicId, workshopId);
  }
}
