import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';

// Entidades propias / relacionadas
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { Appointment } from '../appointment/entities/appointment.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { ServiceEntity } from '../service/entities/service.entity';
import { MechanicReview } from '../mechanic-review/entities/mechanic-review.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';
import { Workshop } from '../workshop/entities/workshop.entity';

// Dtos externos
import { CreateAppointmentDto } from '../appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointment/dto/update-appointment.dto';
import { CreateVehicleDto } from '../vehicle/dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../vehicle/dto/update-vehicle.dto';
import { CreateMechanicReviewDto } from '../mechanic-review/dto/create-mechanic-review.dto';

// Servicios externos
import { MechanicReviewService } from '../mechanic-review/mechanic-review.service';
import { VehicleService } from 'src/vehicle/vehicle.service';

// Domain (solo para negocio)
import { CustomerDomain } from './domain/customer.domain';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,

    @InjectRepository(MechanicReview)
    private readonly reviewRepository: Repository<MechanicReview>,

    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,

    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,

    private readonly mechanicReviewService: MechanicReviewService,

    private readonly vehicleService: VehicleService,

    private readonly domain: CustomerDomain,
  ) {}

  // ===== CRUD Customer (SIN domain) =====
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const entity = this.customerRepository.create(dto);
    return await this.customerRepository.save(entity);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException(`Customer ${id} not found`);
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const res = await this.customerRepository.update(id, dto);
    if (!res.affected) throw new NotFoundException(`Customer ${id} not found`);
    const updated = await this.customerRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException(`Customer ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.customerRepository.softDelete(id);
    if (!res.affected) throw new NotFoundException(`Customer ${id} not found`);
    return { message: `Customer ${id} successfully deleted` };
  }

  // ===== Appointments (Turnos) — CON domain =====
  async createAppointment(
    customerId: string,
    dto: CreateAppointmentDto,
  ): Promise<Appointment> {
    await this.ensureCustomerExists(customerId);

    const [customer, service, workshop] = await Promise.all([
      this.customerRepository.findOneBy({ id: customerId }),
      this.serviceRepository.findOneBy({ id: dto.service_id }),
      this.workshopRepository.findOneBy({ id: dto.workshop_id }),
    ]);
    if (!customer)
      throw new NotFoundException(`Customer ${customerId} not found`);
    if (!service)
      throw new NotFoundException(`Service ${dto.service_id} not found`);
    if (!workshop)
      throw new NotFoundException(`Workshop ${dto.workshop_id} not found`);

    let mechanic: Mechanic | null = null;
    if (dto.mechanic_id) {
      mechanic = await this.mechanicRepository.findOneBy({
        id: dto.mechanic_id,
      });
      if (!mechanic)
        throw new NotFoundException(`Mechanic ${dto.mechanic_id} not found`);
    }

    let vehicle: Vehicle | null = null;
    if (dto.vehicle_id) {
      vehicle = await this.vehicleRepository.findOne({
        where: { id: dto.vehicle_id },
        relations: ['customer'],
      });
      if (!vehicle)
        throw new NotFoundException(`Vehicle ${dto.vehicle_id} not found`);
      if (vehicle.customer?.id !== customerId)
        throw new ForbiddenException(
          'Vehicle does not belong to this customer',
        );
    }

    const appt = this.domain.createAppointment(customer, dto, {
      service,
      workshop,
      mechanic,
      vehicle,
    });
    return await this.appointmentRepository.save(appt);
  }

  async listAppointments(
    customerId: string,
    filter?: { status?: string; from?: string; to?: string },
  ): Promise<Appointment[]> {
    await this.ensureCustomerExists(customerId);

    const where: FindOptionsWhere<Appointment> = {
      customer: { id: customerId } as any,
    };

    if (filter?.status) (where as any).status = filter.status;
    if (filter?.from || filter?.to) {
      const from = filter.from ? new Date(filter.from) : new Date('1970-01-01');
      const to = filter.to ? new Date(filter.to) : new Date('2999-12-31');
      (where as any).scheduled_at = Between(from, to);
    }

    return await this.appointmentRepository.find({
      where,
      relations: ['service', 'mechanic', 'workshop', 'vehicle'],
      order: { scheduled_at: 'DESC' as any },
    });
  }

  async getAppointment(
    customerId: string,
    appointmentId: string,
  ): Promise<Appointment> {
    await this.ensureCustomerExists(customerId);
    const appt = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['customer', 'service', 'mechanic', 'workshop', 'vehicle'],
    });
    if (!appt)
      throw new NotFoundException(`Appointment ${appointmentId} not found`);
    if (appt.customer?.id !== customerId)
      throw new ForbiddenException(
        'Appointment does not belong to this customer',
      );
    return appt;
  }

  async updateAppointment(
    customerId: string,
    appointmentId: string,
    dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appt = await this.getAppointment(customerId, appointmentId);
    this.domain.updateAppointment(appt, dto);
    return await this.appointmentRepository.save(appt);
  }

  async deleteAppointment(
    customerId: string,
    appointmentId: string,
  ): Promise<{ message: string }> {
    await this.getAppointment(customerId, appointmentId); // valida ownership
    const res = await this.appointmentRepository.softDelete({
      id: appointmentId,
    });
    if (!res.affected)
      throw new NotFoundException(`Appointment ${appointmentId} not found`);
    return { message: `Appointment ${appointmentId} successfully deleted` };
  }

  // ===== Vehicles (Vehículos) — CON domain =====
  async createVehicle(
    customerId: string,
    dto: CreateVehicleDto,
  ): Promise<Vehicle> {
    await this.ensureCustomerExists(customerId);
    const owner = await this.customerRepository.findOneBy({ id: customerId });
    if (!owner) throw new NotFoundException(`Customer ${customerId} not found`);
    const vehicle = this.domain.createVehicle(owner, dto);
    return await this.vehicleRepository.save(vehicle);
  }

  async listVehicles(customerId: string): Promise<Vehicle[]> {
    await this.ensureCustomerExists(customerId);
    return await this.vehicleRepository.find({
      where: { customer: { id: customerId } as any },
      relations: ['customer'],
      order: { created_at: 'DESC' as any },
    });
  }

  async getVehicle(customerId: string, vehicleId: string): Promise<Vehicle> {
    await this.ensureCustomerExists(customerId);
    const entity = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
      relations: ['customer'],
    });
    if (!entity) throw new NotFoundException(`Vehicle ${vehicleId} not found`);
    if (entity.customer?.id !== customerId)
      throw new ForbiddenException('Vehicle does not belong to this customer');
    return entity;
  }

  async updateVehicle(
    customerId: string,
    vehicleId: string,
    dto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.getVehicle(customerId, vehicleId);
    this.domain.updateVehicle(vehicle, dto);
    return await this.vehicleRepository.save(vehicle);
  }

  async deleteVehicle(
    customerId: string,
    vehicleId: string,
  ): Promise<{ message: string }> {
    await this.getVehicle(customerId, vehicleId);
    const res = await this.vehicleRepository.softDelete({ id: vehicleId });
    if (!res.affected)
      throw new NotFoundException(`Vehicle ${vehicleId} not found`);
    return { message: `Vehicle ${vehicleId} successfully deleted` };
  }

  // ===== Services =====
  async listServices(): Promise<ServiceEntity[]> {
    return await this.serviceRepository.find();
  }

  // ===== Repairs (Reparaciones del cliente) =====
  // async listRepairsForCustomerVehicle(
  //   customerId: string,
  //   vehicleId: string,
  // ): Promise<Repair[]> {
  //   return await this.vehicleService.listRepairsByVehicle(vehicleId, {
  //     customerId,
  //   });
  // }

  // ===== Reviews (Calificar mecánico) — (dejamos validaciones I/O + service existente) =====
  async rateMechanic(
    customerId: string,
    dto: CreateMechanicReviewDto,
  ): Promise<MechanicReview> {
    const mechanic = await this.mechanicRepository.findOneBy({
      id: dto.mechanic_id,
    });
    if (!mechanic)
      throw new NotFoundException(`Mechanic ${dto.mechanic_id} not found`);

    if (dto.appointment_id) {
      const appt = await this.appointmentRepository.findOne({
        where: { id: dto.appointment_id },
        relations: ['customer', 'mechanic'],
      });
      if (!appt)
        throw new NotFoundException(
          `Appointment ${dto.appointment_id} not found`,
        );
      if (appt.customer?.id !== customerId)
        throw new ForbiddenException(
          'Appointment does not belong to this customer',
        );
      if (appt.mechanic?.id !== dto.mechanic_id)
        throw new ForbiddenException(
          'Appointment mechanic does not match review mechanic',
        );
    }

    // Persistimos con el servicio existente (recalcula agregados)
    return await this.mechanicReviewService.create({
      ...dto,
      customer_id: customerId,
    });
  }

  // ===== Helpers =====
  private async ensureCustomerExists(id: string) {
    const found = await this.customerRepository.findOneBy({ id });
    if (!found) throw new NotFoundException(`Customer ${id} not found`);
  }
}
