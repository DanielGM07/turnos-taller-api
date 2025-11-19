import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateMechanicDto } from 'src/mechanic/dto/update-mechanic.dto';
import { UpdateWorkshopDto } from 'src/workshop/dto/update-workshop.dto';
import { CreateWorkshopDto } from 'src/workshop/dto/create-workshop.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('workshops')
  async listWorkshops() {
    return await this.adminService.listWorkshops();
  }

  @Post()
  async create(@Body() dto: CreateAdminDto) {
    return await this.adminService.create(dto);
  }

  @Get('dashboard')
  async getDashboard() {
    return await this.adminService.getDashboardStats();
  }

  @Get()
  async findAll() {
    return await this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adminService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return await this.adminService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.adminService.remove(id);
  }

  // ===== WORKSHOPS (crear/ver/modificar/eliminar) =====
  @Post('workshops')
  async createWorkshop(@Body() dto: CreateWorkshopDto) {
    return await this.adminService.createWorkshop(dto);
  }

  // @Get('workshops')
  // async listWorkshops() {
  //   return await this.adminService.listWorkshops();
  // }

  @Get('workshops/:workshopId')
  async getWorkshop(@Param('workshopId', ParseUUIDPipe) workshopId: string) {
    return await this.adminService.getWorkshop(workshopId);
  }

  @Patch('workshops/:workshopId')
  async updateWorkshop(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Body() dto: UpdateWorkshopDto,
  ) {
    return await this.adminService.updateWorkshop(workshopId, dto);
  }

  @Delete('workshops/:workshopId')
  async deleteWorkshop(@Param('workshopId', ParseUUIDPipe) workshopId: string) {
    return await this.adminService.deleteWorkshop(workshopId);
  }

  // ===== MECHANICS (ver/modificar/eliminar) =====
  @Get('mechanics')
  async listMechanics() {
    return await this.adminService.listMechanics();
  }

  @Get('mechanics/:mechanicId')
  async getMechanic(@Param('mechanicId', ParseUUIDPipe) mechanicId: string) {
    return await this.adminService.getMechanic(mechanicId);
  }

  @Patch('mechanics/:mechanicId')
  async updateMechanic(
    @Param('mechanicId', ParseUUIDPipe) mechanicId: string,
    @Body() dto: UpdateMechanicDto,
  ) {
    return await this.adminService.updateMechanic(mechanicId, dto);
  }

  @Delete('mechanics/:mechanicId')
  async deleteMechanic(@Param('mechanicId', ParseUUIDPipe) mechanicId: string) {
    return await this.adminService.deleteMechanic(mechanicId);
  }

  // ===== APPOINTMENTS DE UN TALLER (solo lectura admin) =====
  @Get('workshops/:workshopId/appointments')
  async listWorkshopAppointments(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
  ) {
    return await this.adminService.listWorkshopAppointments(workshopId);
  }

  @Get('mechanics/:mechanicId/reviews')
  async listMechanicReviews(@Param('mechanicId') mechanicId: string) {
    return this.adminService.listMechanicReviews(mechanicId);
  }
}
