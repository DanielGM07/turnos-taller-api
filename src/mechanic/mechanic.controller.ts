import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { UpdateAppointmentDto } from 'src/appointment/dto/update-appointment.dto';

@Controller('mechanic')
export class MechanicController {
  constructor(private readonly mechanicService: MechanicService) {}

  @Post()
  async create(@Body() dto: CreateMechanicDto) {
    return await this.mechanicService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.mechanicService.findAll();
  }

  @Get('workshops')
  async listAllWorkshops() {
    return await this.mechanicService.listAllWorkshops();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.mechanicService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMechanicDto) {
    return await this.mechanicService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.mechanicService.remove(id);
  }

  // Endpoints opcionales para manejar relación N–N con talleres
  @Post(':mechanicId/workshops/:workshopId')
  async linkWorkshop(
    @Param('mechanicId') mechanicId: string,
    @Param('workshopId') workshopId: string,
  ) {
    return await this.mechanicService.linkWorkshop(mechanicId, workshopId);
  }

  @Delete(':mechanicId/workshops/:workshopId')
  async unlinkWorkshop(
    @Param('mechanicId') mechanicId: string,
    @Param('workshopId') workshopId: string,
  ) {
    return await this.mechanicService.unlinkWorkshop(mechanicId, workshopId);
  }

  // === Turnos asignados (propios) ===

  @Get(':mechanicId/appointments')
  async listMyAppointments(
    @Param('mechanicId', ParseUUIDPipe) mechanicId: string,
    @Query() query: { status?: string; from?: string; to?: string },
  ) {
    return await this.mechanicService.listMyAppointments(mechanicId, query);
  }

  @Patch(':mechanicId/appointments/:appointmentId')
  async updateMyAppointment(
    @Param('mechanicId', ParseUUIDPipe) mechanicId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return await this.mechanicService.updateMyAppointment(
      mechanicId,
      appointmentId,
      dto,
    );
  }

  @Delete(':mechanicId/appointments/:appointmentId')
  async deleteMyAppointment(
    @Param('mechanicId', ParseUUIDPipe) mechanicId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return await this.mechanicService.deleteMyAppointment(
      mechanicId,
      appointmentId,
    );
  }

  // === Customers ===

  @Get('customers')
  async listAllCustomers() {
    return await this.mechanicService.listAllCustomers();
  }

  @Get(':mechanicId/customers')
  async listAssignedCustomers(
    @Param('mechanicId', ParseUUIDPipe) mechanicId: string,
  ) {
    return await this.mechanicService.listAssignedCustomers(mechanicId);
  }

  // === Workshops (talleres) ===

  // @Get('workshops')
  // async listAllWorkshops() {
  //   return await this.mechanicService.listAllWorkshops();
  // }

  @Get(':mechanicId/workshops')
  async listMyWorkshops(
    @Param('mechanicId', ParseUUIDPipe) mechanicId: string,
  ) {
    return await this.mechanicService.listMyWorkshops(mechanicId);
  }

  @Post(':mechanicId/workshops/:workshopId/enroll')
  async enrollWorkshop(
    @Param('mechanicId', ParseUUIDPipe) mechanicId: string,
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
  ) {
    return await this.mechanicService.enrollWorkshop(mechanicId, workshopId);
  }

  @Delete(':mechanicId/workshops/:workshopId/unenroll')
  async unenrollWorkshop(
    @Param('mechanicId', ParseUUIDPipe) mechanicId: string,
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
  ) {
    return await this.mechanicService.unenrollWorkshop(mechanicId, workshopId);
  }
}
