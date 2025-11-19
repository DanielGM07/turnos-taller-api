import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { Workshop } from '../workshop/entities/workshop.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { UpdateAppointmentDto } from 'src/appointment/dto/update-appointment.dto';

// Domain (solo negocio)
import { MechanicDomain } from './domain/mechanic.domain';

@Injectable()
export class MechanicService {
  constructor(
    @InjectRepository(Mechanic) private readonly mechRepo: Repository<Mechanic>,
    @InjectRepository(Workshop)
    private readonly workshopRepo: Repository<Workshop>,
    @InjectRepository(Appointment)
    private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly domain: MechanicDomain,
  ) {}

  // ===== CRUD Mechanic (SIN domain) =====
  async create(dto: CreateMechanicDto) {
    try {
      const specialties = dto.specialties
        ? dto.specialties.split(',').map((s) => s.trim())
        : [];
      const entity = this.mechRepo.create({ ...dto, specialties });
      return await this.mechRepo.save(entity);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.mechRepo.find({ relations: ['workshops'] });
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      const found = await this.mechRepo.findOne({
        where: { id },
        relations: ['workshops'],
      });
      if (!found)
        throw new NotFoundException(`Mechanic with ID ${id} not found.`);
      return found;
    } catch (error) {
      throw error;
    }
  }

  // async update(id: string, dto: UpdateMechanicDto) {
  //   try {
  //     const partial: any = { ...dto };
  //     if (dto.specialties !== undefined)
  //       partial.specialties = dto.specialties.split(',').map((s) => s.trim());
  //     const result = await this.mechRepo.update(id, partial);
  //     if (!result.affected)
  //       throw new NotFoundException(`Mechanic with ID ${id} not found.`);
  //     const updated = await this.mechRepo.findOne({
  //       where: { id },
  //       relations: ['workshops'],
  //     });
  //     if (!updated)
  //       throw new NotFoundException(`Mechanic with ID ${id} not found.`);
  //     return updated;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async update(id: string, dto: any) {
    const mechanic = await this.mechRepo.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!mechanic) throw new NotFoundException('Mechanic not found');

    Object.assign(mechanic, dto);

    return await this.mechRepo.save(mechanic);
  }

  async remove(id: string) {
    try {
      const res = await this.mechRepo.softDelete({ id });
      if (!res.affected)
        throw new NotFoundException(`Mechanic with ID ${id} not found.`);
      return { message: `Mechanic with ID ${id} successfully deleted.` };
    } catch (error) {
      throw error;
    }
  }

  // ===== Workshops (negocio) — CON domain para evitar duplicados/mutar memoria =====
  async linkWorkshop(mechanicId: string, workshopId: string) {
    try {
      const [mech, ws] = await Promise.all([
        this.mechRepo.findOne({
          where: { id: mechanicId },
          relations: ['workshops'],
        }),
        this.workshopRepo.findOne({ where: { id: workshopId } }),
      ]);
      if (!mech)
        throw new NotFoundException(
          `Mechanic with ID ${mechanicId} not found.`,
        );
      if (!ws)
        throw new NotFoundException(
          `Workshop with ID ${workshopId} not found.`,
        );

      this.domain.enrollWorkshop(mech, ws);
      return await this.mechRepo.save(mech);
    } catch (error) {
      throw error;
    }
  }

  async unlinkWorkshop(mechanicId: string, workshopId: string) {
    try {
      const mech = await this.mechRepo.findOne({
        where: { id: mechanicId },
        relations: ['workshops'],
      });
      if (!mech)
        throw new NotFoundException(
          `Mechanic with ID ${mechanicId} not found.`,
        );
      this.domain.unenrollWorkshop(mech, workshopId);
      return await this.mechRepo.save(mech);
    } catch (error) {
      throw error;
    }
  }

  // ===== Turnos asignados (negocio) — CON domain =====
  async listMyAppointments(
    mechanicId: string,
    filter?: { status?: string; from?: string; to?: string },
  ): Promise<Appointment[]> {
    await this.ensureMechanicExists(mechanicId);

    const where: any = { mechanic: { id: mechanicId } };
    if (filter?.status) where.status = filter.status;
    if (filter?.from || filter?.to) {
      const from = filter.from ? new Date(filter.from) : new Date('1970-01-01');
      const to = filter.to ? new Date(filter.to) : new Date('2999-12-31');
      where.scheduled_at = Between(from, to);
    }

    return await this.apptRepo.find({
      where,
      relations: ['customer', 'service', 'workshop', 'vehicle'],
      order: { scheduled_at: 'DESC' as any },
    });
  }

  async updateMyAppointment(
    mechanicId: string,
    appointmentId: string,
    dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    await this.ensureMechanicExists(mechanicId);
    const appt = await this.getOwnedAppointment(mechanicId, appointmentId);
    this.domain.updateMyAppointment(appt, dto);
    return await this.apptRepo.save(appt);
  }

  async deleteMyAppointment(
    mechanicId: string,
    appointmentId: string,
  ): Promise<{ message: string }> {
    await this.ensureMechanicExists(mechanicId);
    await this.getOwnedAppointment(mechanicId, appointmentId);

    const res = await this.apptRepo.softDelete({ id: appointmentId });
    if (!res.affected)
      throw new NotFoundException(`Appointment ${appointmentId} not found`);

    return { message: `Appointment ${appointmentId} successfully deleted` };
  }

  // ===== Customers =====
  async listAllCustomers(): Promise<Customer[]> {
    return await this.customerRepo.find();
  }

  async listAssignedCustomers(mechanicId: string): Promise<Customer[]> {
    await this.ensureMechanicExists(mechanicId);

    const appts = await this.apptRepo.find({
      where: { mechanic: { id: mechanicId } as any },
      relations: ['customer'],
    });

    const map = new Map<string, Customer>();
    for (const a of appts) {
      if (a.customer) map.set(a.customer.id, a.customer);
    }
    return Array.from(map.values());
  }

  // ===== Helpers =====
  private async ensureMechanicExists(mechanicId: string) {
    const m = await this.mechRepo.findOne({ where: { id: mechanicId } });
    if (!m) throw new NotFoundException(`Mechanic ${mechanicId} not found`);
    return m;
  }

  private async getOwnedAppointment(
    mechanicId: string,
    appointmentId: string,
  ): Promise<Appointment> {
    const appt = await this.apptRepo.findOne({
      where: { id: appointmentId },
      relations: ['mechanic', 'customer', 'service', 'workshop', 'vehicle'],
    });
    if (!appt)
      throw new NotFoundException(`Appointment ${appointmentId} not found`);
    if (appt.mechanic?.id !== mechanicId)
      throw new ForbiddenException(
        'Appointment does not belong to this mechanic',
      );
    return appt;
  }

  // ===== Workshops =====
  async listAllWorkshops(): Promise<Workshop[]> {
    return await this.workshopRepo.find({ relations: ['mechanics'] });
  }

  async listMyWorkshops(mechanicId: string): Promise<Workshop[]> {
    await this.ensureMechanicExists(mechanicId);
    return await this.workshopRepo.find({
      where: { mechanics: { id: mechanicId } as any },
      relations: ['mechanics'],
      order: { created_at: 'DESC' as any }, // quitalo si tu entidad no tiene este campo
    });
  }

  async enrollWorkshop(mechanicId: string, workshopId: string) {
    // carga entidades
    const [mech, ws] = await Promise.all([
      this.mechRepo.findOne({
        where: { id: mechanicId },
        relations: ['workshops'],
      }),
      this.workshopRepo.findOne({
        where: { id: workshopId },
        relations: ['mechanics'],
      }),
    ]);
    if (!mech)
      throw new NotFoundException(`Mechanic with ID ${mechanicId} not found.`);
    if (!ws)
      throw new NotFoundException(`Workshop with ID ${workshopId} not found.`);

    // evita duplicado
    const already = (mech.workshops ?? []).some((w) => w.id === workshopId);
    if (already)
      throw new ConflictException('Already enrolled in this workshop');

    // muta con domain y guarda
    this.domain.enrollWorkshop(mech, ws);
    await this.mechRepo.save(mech);

    // devuelve el workshop actualizado (como en tu implementación previa)
    return await this.workshopRepo.findOne({
      where: { id: workshopId },
      relations: ['mechanics'],
    });
  }

  async unenrollWorkshop(mechanicId: string, workshopId: string) {
    const mech = await this.mechRepo.findOne({
      where: { id: mechanicId },
      relations: ['workshops'],
    });
    if (!mech)
      throw new NotFoundException(`Mechanic with ID ${mechanicId} not found.`);

    const isMember = (mech.workshops ?? []).some((w) => w.id === workshopId);
    if (!isMember) throw new NotFoundException('Mechanic is not enrolled');

    this.domain.unenrollWorkshop(mech, workshopId);
    await this.mechRepo.save(mech);

    return { message: 'Unenrolled from workshop successfully' };
  }
}
