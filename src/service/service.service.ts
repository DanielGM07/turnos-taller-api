import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly repo: Repository<ServiceEntity>,
  ) {}

  async create(dto: CreateServiceDto) {
    try {
      return await this.repo.save(this.repo.create(dto));
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
        throw new NotFoundException(`Service with ID ${id} not found.`);
      return found;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateServiceDto) {
    try {
      const result = await this.repo.update(id, dto);
      if (!result.affected)
        throw new NotFoundException(`Service with ID ${id} not found.`);
      const updated = await this.repo.findOne({ where: { id } });
      if (!updated)
        throw new NotFoundException(`Service with ID ${id} not found.`);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repo.softDelete({ id });
      if (!res.affected)
        throw new NotFoundException(`Service with ID ${id} not found.`);
      return { message: `Service with ID ${id} successfully deleted.` };
    } catch (error) {
      throw error;
    }
  }
}
