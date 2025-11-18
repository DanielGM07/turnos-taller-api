import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(@Body() dto: CreateVehicleDto) {
    return await this.vehicleService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.vehicleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.vehicleService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return await this.vehicleService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.vehicleService.remove(id);
  }
}
