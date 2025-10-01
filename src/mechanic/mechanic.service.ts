import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';
import { Workshop } from '../workshop/entities/workshop.entity';

@Injectable()
export class MechanicService {
  constructor(
    @InjectRepository(Mechanic) private readonly repo: Repository<Mechanic>,
    @InjectRepository(Workshop)
    private readonly workshopRepo: Repository<Workshop>,
  ) {}

  async create(dto: CreateMechanicDto) {
    try {
      const specialties = dto.specialties
        ? dto.specialties.split(',').map((s) => s.trim())
        : [];
      const entity = this.repo.create({ ...dto, specialties });
      return await this.repo.save(entity);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.repo.find({ relations: ['workshops'] });
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      const found = await this.repo.findOne({
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

  async update(id: string, dto: UpdateMechanicDto) {
    try {
      const partial: any = { ...dto };
      if (dto.specialties !== undefined)
        partial.specialties = dto.specialties.split(',').map((s) => s.trim());
      const result = await this.repo.update(id, partial);
      if (!result.affected)
        throw new NotFoundException(`Mechanic with ID ${id} not found.`);
      const updated = await this.repo.findOne({
        where: { id },
        relations: ['workshops'],
      });
      if (!updated)
        throw new NotFoundException(`Mechanic with ID ${id} not found.`);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repo.softDelete({ id });
      if (!res.affected)
        throw new NotFoundException(`Mechanic with ID ${id} not found.`);
      return { message: `Mechanic with ID ${id} successfully deleted.` };
    } catch (error) {
      throw error;
    }
  }

  // Vincular/desvincular con N–N implícita
  async linkWorkshop(mechanicId: string, workshopId: string) {
    try {
      const mech = await this.repo.findOne({
        where: { id: mechanicId },
        relations: ['workshops'],
      });
      if (!mech)
        throw new NotFoundException(
          `Mechanic with ID ${mechanicId} not found.`,
        );
      const ws = await this.workshopRepo.findOne({ where: { id: workshopId } });
      if (!ws)
        throw new NotFoundException(
          `Workshop with ID ${workshopId} not found.`,
        );
      mech.workshops = [...(mech.workshops ?? []), ws];
      return await this.repo.save(mech);
    } catch (error) {
      throw error;
    }
  }

  async unlinkWorkshop(mechanicId: string, workshopId: string) {
    try {
      const mech = await this.repo.findOne({
        where: { id: mechanicId },
        relations: ['workshops'],
      });
      if (!mech)
        throw new NotFoundException(
          `Mechanic with ID ${mechanicId} not found.`,
        );
      mech.workshops = (mech.workshops ?? []).filter(
        (w) => w.id !== workshopId,
      );
      return await this.repo.save(mech);
    } catch (error) {
      throw error;
    }
  }
}
