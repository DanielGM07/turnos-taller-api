import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
  ) {}

  create(dto: CreateAppointmentDto) {
    const entity = this.repo.create({
      ...dto,
      scheduled_at: new Date(dto.scheduled_at),
      service: { id: dto.service_id } as any,
      customer: { id: dto.customer_id } as any,
      mechanic: { id: dto.mechanic_id } as any,
      workshop: { id: dto.workshop_id } as any,
      vehicle: dto.vehicle_id ? ({ id: dto.vehicle_id } as any) : undefined,
    });
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Appointment ${id} not found`);
    return found;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const partial: any = { ...dto };
    if (dto.scheduled_at) partial.scheduled_at = new Date(dto.scheduled_at);
    await this.repo.update(id, partial);
    const updated = await this.repo.findOne({ where: { id } });
    if (!updated) throw new NotFoundException(`Appointment ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const res = await this.repo.softDelete({ id });
    if (!res.affected)
      throw new NotFoundException(`Appointment ${id} not found`);
    return { message: `Appointment ${id} successfully deleted` };
  }
}
