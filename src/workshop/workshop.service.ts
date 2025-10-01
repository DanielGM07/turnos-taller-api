import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from './entities/workshop.entity';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@Injectable()
export class WorkshopService {
  constructor(
    @InjectRepository(Workshop) private readonly repo: Repository<Workshop>,
  ) {}

  async create(dto: CreateWorkshopDto): Promise<Workshop> {
    try {
      return await this.repo.save(this.repo.create(dto));
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Workshop[]> {
    try {
      return await this.repo.find({ relations: ['mechanics'] });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Workshop> {
    try {
      const found = await this.repo.findOne({
        where: { id },
        relations: ['mechanics'],
      });
      if (!found)
        throw new NotFoundException(`Workshop with ID ${id} not found.`);
      return found;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateWorkshopDto): Promise<Workshop> {
    try {
      const result = await this.repo.update(id, dto);
      if (!result.affected)
        throw new NotFoundException(`Workshop with ID ${id} not found.`);
      const updated = await this.repo.findOne({
        where: { id },
        relations: ['mechanics'],
      });
      if (!updated)
        throw new NotFoundException(`Workshop with ID ${id} not found.`);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const res = await this.repo.softDelete({ id });
      if (!res.affected)
        throw new NotFoundException(`Workshop with ID ${id} not found.`);
      return { message: `Workshop with ID ${id} successfully deleted.` };
    } catch (error) {
      throw error;
    }
  }
}
