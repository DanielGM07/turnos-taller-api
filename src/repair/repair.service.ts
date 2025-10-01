import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repair } from './entities/repair.entity';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';

@Injectable()
export class RepairService {
  constructor(
    @InjectRepository(Repair) private readonly repo: Repository<Repair>,
  ) {}

  async create(dto: CreateRepairDto) {
    try {
      const entity = this.repo.create({
        ...dto,
        vehicle: { id: dto.vehicle_id } as any,
        service: { id: dto.service_id } as any,
        appointment: dto.appointment_id
          ? ({ id: dto.appointment_id } as any)
          : undefined,
      });
      return await this.repo.save(entity);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.repo.find();
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      const found = await this.repo.findOne({ where: { id } });
      if (!found)
        throw new NotFoundException(`Repair with ID ${id} not found.`);
      return found;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateRepairDto) {
    try {
      const result = await this.repo.update(id, dto as any);
      if (!result.affected)
        throw new NotFoundException(`Repair with ID ${id} not found.`);
      const updated = await this.repo.findOne({ where: { id } });
      if (!updated)
        throw new NotFoundException(`Repair with ID ${id} not found.`);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repo.softDelete({ id });
      if (!res.affected)
        throw new NotFoundException(`Repair with ID ${id} not found.`);
      return { message: `Repair with ID ${id} successfully deleted.` };
    } catch (error) {
      throw error;
    }
  }
}
