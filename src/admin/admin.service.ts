// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { WorkshopService } from 'src/workshop/workshop.service';
import { MechanicService } from 'src/mechanic/mechanic.service';
import { CreateWorkshopDto } from 'src/workshop/dto/create-workshop.dto';
import { UpdateWorkshopDto } from 'src/workshop/dto/update-workshop.dto';
import { UpdateMechanicDto } from 'src/mechanic/dto/update-mechanic.dto';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { MechanicReview } from 'src/mechanic-review/entities/mechanic-review.entity';

// 👇 nuevas imports
import { Customer } from 'src/customer/entities/customer.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    // repos para métricas
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(MechanicReview)
    private readonly mechanicReviewRepository: Repository<MechanicReview>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,

    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,

    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,

    // servicios que ya tenías
    private readonly workshopService: WorkshopService,
    private readonly mechanicService: MechanicService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      const admin = this.adminRepository.create(createAdminDto);
      return await this.adminRepository.save(admin);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Admin[]> {
    try {
      return await this.adminRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findOneBy({ id });
      if (!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
  //   try {
  //     const result = await this.adminRepository.update(id, updateAdminDto);
  //     if (result.affected === 0)
  //       throw new NotFoundException(`Admin with ID ${id} not found`);
  //     const admin = await this.adminRepository.findOneBy({ id });
  //     if (!admin)
  //       throw new NotFoundException(
  //         `Admin with ID ${id} not found after update`,
  //       );
  //     return admin;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async update(id: string, dto: any) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      select: ['id', 'password'], // importante para poder reasignar password
    });

    if (!admin) throw new NotFoundException('Admin not found');

    Object.assign(admin, dto);

    return await this.adminRepository.save(admin); // ejecuta BeforeUpdate()
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.adminRepository.softDelete({ id });
      if (result.affected === 0)
        throw new NotFoundException(`Admin with ID ${id} not found`);
      return { message: `Admin with ID ${id} successfully deleted` };
    } catch (error) {
      throw error;
    }
  }

  // ===== WORKSHOPS ===== (delegado al módulo Workshop)
  async createWorkshop(dto: CreateWorkshopDto) {
    return this.workshopService.create(dto);
  }
  async listWorkshops() {
    return this.workshopService.findAll();
  }
  async getWorkshop(workshopId: string) {
    return this.workshopService.findOne(workshopId);
  }
  async updateWorkshop(workshopId: string, dto: UpdateWorkshopDto) {
    return this.workshopService.update(workshopId, dto);
  }
  async deleteWorkshop(workshopId: string) {
    return this.workshopService.remove(workshopId);
  }

  // ===== MECHANICS ===== (delegado al módulo Mechanic)
  async listMechanics() {
    return this.mechanicService.findAll();
  }
  async getMechanic(mechanicId: string) {
    return this.mechanicService.findOne(mechanicId);
  }
  async updateMechanic(mechanicId: string, dto: UpdateMechanicDto) {
    return this.mechanicService.update(mechanicId, dto);
  }
  async deleteMechanic(mechanicId: string) {
    return this.mechanicService.remove(mechanicId);
  }

  async listWorkshopAppointments(workshopId: string) {
    // opcional: asegurarse que el taller existe
    await this.workshopService.findOne(workshopId);

    return await this.appointmentRepository.find({
      where: { workshop: { id: workshopId } as any },
      relations: ['customer', 'mechanic', 'service', 'vehicle', 'workshop'],
      order: { scheduled_at: 'DESC' as any },
    });
  }

  async listMechanicReviews(mechanicId: string) {
    return await this.mechanicReviewRepository.find({
      where: { mechanic: { id: mechanicId } as any },
      relations: ['customer', 'mechanic', 'appointment'],
      order: { created_at: 'DESC' as any },
    });
  }

  async getDashboardStats() {
    // últimos 30 días
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    // ===== Totales generales =====
    const [
      appointmentsTotal,
      customersTotal,
      mechanicsTotal,
      workshopsTotal,
      vehiclesTotal,
      servicesTotal,
      paymentsTotal,
      reviewsTotal,
    ] = await Promise.all([
      this.appointmentRepository.count({ where: { deleted_at: null as any } }),
      this.customerRepository.count({ where: { deleted_at: null as any } }),
      this.mechanicRepository.count({ where: { deleted_at: null as any } }),
      this.workshopRepository.count({ where: { deleted_at: null as any } }),
      this.vehicleRepository.count({ where: { deleted_at: null as any } }),
      this.serviceRepository.count({ where: { deleted_at: null as any } }),
      this.paymentRepository.count({ where: { deleted_at: null as any } }),
      this.mechanicReviewRepository.count({
        where: { deleted_at: null as any },
      }),
    ]);

    // ===== Turnos por estado =====
    const appointmentsByStatus = await this.appointmentRepository
      .createQueryBuilder('a')
      .select('a.status', 'status')
      .addSelect('COUNT(1)', 'count')
      .where('a.deleted_at IS NULL')
      .groupBy('a.status')
      .getRawMany();

    // ===== Turnos por día (últimos 30 días) – MySQL =====
    const appointmentsPerDay = await this.appointmentRepository
      .createQueryBuilder('a')
      .select('DATE(a.scheduled_at)', 'date')
      .addSelect('COUNT(1)', 'count')
      .where('a.scheduled_at >= :from', { from: fromDate })
      .andWhere('a.deleted_at IS NULL')
      .groupBy('DATE(a.scheduled_at)')
      .orderBy('DATE(a.scheduled_at)', 'ASC')
      .getRawMany();

    // ===== Revenue por día (si tenés payments) =====
    const revenuePerDay = await this.paymentRepository
      .createQueryBuilder('p')
      .select('DATE(p.created_at)', 'date')
      .addSelect('SUM(p.amount_total)', 'total')
      .where('p.deleted_at IS NULL')
      .groupBy('DATE(p.created_at)')
      .orderBy('DATE(p.created_at)', 'ASC')
      .getRawMany();

    // ===== Top mecánicos por rating promedio =====
    const topMechanics = await this.mechanicRepository.find({
      where: { deleted_at: null as any },
      order: { average_rating: 'DESC' as any, ratings_count: 'DESC' as any },
      take: 5,
    });

    // podés agregar más secciones si querés

    return {
      totals: {
        appointments: appointmentsTotal,
        customers: customersTotal,
        mechanics: mechanicsTotal,
        workshops: workshopsTotal,
        vehicles: vehiclesTotal,
        services: servicesTotal,
        payments: paymentsTotal,
        reviews: reviewsTotal,
      },
      appointmentsByStatus,
      appointmentsPerDay,
      revenuePerDay,
      topMechanics,
    };
  }
}
