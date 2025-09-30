import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MechanicWorkshopService } from './mechanic-workshop.service';
import { CreateMechanicWorkshopDto } from './dto/create-mechanic-workshop.dto';
import { UpdateMechanicWorkshopDto } from './dto/update-mechanic-workshop.dto';

@Controller('mechanic-workshop')
export class MechanicWorkshopController {
  constructor(private readonly mechanicWorkshopService: MechanicWorkshopService) {}

  @Post()
  create(@Body() createMechanicWorkshopDto: CreateMechanicWorkshopDto) {
    return this.mechanicWorkshopService.create(createMechanicWorkshopDto);
  }

  @Get()
  findAll() {
    return this.mechanicWorkshopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mechanicWorkshopService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMechanicWorkshopDto: UpdateMechanicWorkshopDto) {
    return this.mechanicWorkshopService.update(+id, updateMechanicWorkshopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mechanicWorkshopService.remove(+id);
  }
}
