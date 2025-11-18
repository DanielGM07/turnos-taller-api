import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';

// Dtos existentes
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

// Dtos de módulos relacionados (ya los tenés)
import { CreateAppointmentDto } from '../appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointment/dto/update-appointment.dto';
import { CreateVehicleDto } from '../vehicle/dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../vehicle/dto/update-vehicle.dto';
import { CreateMechanicReviewDto } from '../mechanic-review/dto/create-mechanic-review.dto';

// (Opcional) constants swagger si querés emular el estilo Receptionist
const CUSTOMER_SWAGGER = {
  TAG: 'Customers',
  CREATE: { SUMMARY: 'Create customer' },
  FIND_ALL: { SUMMARY: 'List customers' },
  FIND_ONE: { SUMMARY: 'Get customer by id' },
  UPDATE: { SUMMARY: 'Update customer' },
  DELETE: { SUMMARY: 'Delete customer' },
  APPTS: {
    CREATE: { SUMMARY: 'Customer schedules an appointment' },
    LIST: { SUMMARY: 'List customer appointments' },
    GET: { SUMMARY: 'Get one appointment (owned by customer)' },
    UPDATE: { SUMMARY: 'Update appointment (owned by customer)' },
    DELETE: { SUMMARY: 'Delete appointment (owned by customer)' },
  },
  VEHICLES: {
    CREATE: { SUMMARY: 'Create vehicle for customer' },
    LIST: { SUMMARY: 'List customer vehicles' },
    GET: { SUMMARY: 'Get one vehicle (owned by customer)' },
    UPDATE: { SUMMARY: 'Update vehicle (owned by customer)' },
    DELETE: { SUMMARY: 'Delete vehicle (owned by customer)' },
  },
  SERVICES: { LIST: { SUMMARY: 'List available services' } },
  REPAIRS: { LIST: { SUMMARY: 'List customer repairs' } },
  REVIEWS: { CREATE: { SUMMARY: 'Rate a mechanic' } },
};

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // ===== CRUD Customer =====

  @Post()
  @ApiOperation({ summary: CUSTOMER_SWAGGER.CREATE.SUMMARY })
  async create(@Body() dto: CreateCustomerDto) {
    return await this.customerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: CUSTOMER_SWAGGER.FIND_ALL.SUMMARY })
  async findAll() {
    return await this.customerService.findAll();
  }

  @Get('services')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.SERVICES.LIST.SUMMARY })
  async listServices() {
    return await this.customerService.listServices();
  }

  @Get(':id')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.FIND_ONE.SUMMARY })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.customerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.UPDATE.SUMMARY })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return await this.customerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.DELETE.SUMMARY })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.customerService.remove(id);
  }

  // ===== Appointments (Turnos) =====

  @Post(':customerId/appointments')
  @HttpCode(201)
  @ApiOperation({ summary: CUSTOMER_SWAGGER.APPTS.CREATE.SUMMARY })
  async createAppointment(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() body: CreateAppointmentDto,
  ) {
    // Sobrescribimos customer_id para asegurar ownership
    return await this.customerService.createAppointment(customerId, body);
  }

  @Get(':customerId/appointments')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.APPTS.LIST.SUMMARY })
  async listAppointments(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query() query: { status?: string; from?: string; to?: string },
  ) {
    return await this.customerService.listAppointments(customerId, query);
  }

  @Get(':customerId/appointments/:appointmentId')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.APPTS.GET.SUMMARY })
  async getAppointment(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return await this.customerService.getAppointment(customerId, appointmentId);
  }

  @Patch(':customerId/appointments/:appointmentId')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.APPTS.UPDATE.SUMMARY })
  async updateAppointment(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return await this.customerService.updateAppointment(
      customerId,
      appointmentId,
      dto,
    );
  }

  @Delete(':customerId/appointments/:appointmentId')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.APPTS.DELETE.SUMMARY })
  async deleteAppointment(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return await this.customerService.deleteAppointment(
      customerId,
      appointmentId,
    );
  }

  // ===== Vehicles (Vehículos) =====

  @Post(':customerId/vehicles')
  @HttpCode(201)
  @ApiOperation({ summary: CUSTOMER_SWAGGER.VEHICLES.CREATE.SUMMARY })
  async createVehicle(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: CreateVehicleDto,
  ) {
    return await this.customerService.createVehicle(customerId, dto);
  }

  @Get(':customerId/vehicles')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.VEHICLES.LIST.SUMMARY })
  async listVehicles(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return await this.customerService.listVehicles(customerId);
  }

  @Get(':customerId/vehicles/:vehicleId')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.VEHICLES.GET.SUMMARY })
  async getVehicle(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ) {
    return await this.customerService.getVehicle(customerId, vehicleId);
  }

  @Patch(':customerId/vehicles/:vehicleId')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.VEHICLES.UPDATE.SUMMARY })
  async updateVehicle(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return await this.customerService.updateVehicle(customerId, vehicleId, dto);
  }

  @Delete(':customerId/vehicles/:vehicleId')
  @ApiOperation({ summary: CUSTOMER_SWAGGER.VEHICLES.DELETE.SUMMARY })
  async deleteVehicle(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ) {
    return await this.customerService.deleteVehicle(customerId, vehicleId);
  }

  // ===== Services (Servicios disponibles) =====

  // @Get('services')
  // @ApiOperation({ summary: CUSTOMER_SWAGGER.SERVICES.LIST.SUMMARY })
  // async listServices() {
  //   return await this.customerService.listServices();
  // }

  // ===== Repairs (Reparaciones del cliente) =====

  // @Get(':customerId/vehicles/:vehicleId/repairs')
  // @ApiOperation({ summary: 'Listar reparaciones de un vehículo del cliente' })
  // async listVehicleRepairsForCustomer(
  //   @Param('customerId', ParseUUIDPipe) customerId: string,
  //   @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  // ) {
  //   return await this.customerService.listRepairsForCustomerVehicle(
  //     customerId,
  //     vehicleId,
  //   );
  // }

  // ===== Reviews (Calificar mecánico) =====

  @Post(':customerId/mechanic-reviews')
  @HttpCode(201)
  @ApiOperation({ summary: CUSTOMER_SWAGGER.REVIEWS.CREATE.SUMMARY })
  async rateMechanic(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() dto: CreateMechanicReviewDto,
  ) {
    // Fuerza que el review sea del propio customer
    return await this.customerService.rateMechanic(customerId, dto);
  }
}
