import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectRepository(WorkOrder) private readonly repo: Repository<WorkOrder>,
  ) {}

  async create(dto: CreateWorkOrderDto) {
    try {
      const entity = this.repo.create({
        ...dto,
        start_date: new Date(dto.start_date),
        end_date: dto.end_date ? new Date(dto.end_date) : undefined,
        appointment: { id: dto.appointment_id } as any,
        mechanic: { id: dto.mechanic_id } as any,
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
        throw new NotFoundException(`WorkOrder with ID ${id} not found.`);
      return found;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateWorkOrderDto) {
    try {
      const partial: any = { ...dto };
      if (dto.start_date) partial.start_date = new Date(dto.start_date);
      if (dto.end_date !== undefined)
        partial.end_date = dto.end_date ? new Date(dto.end_date) : null;
      const result = await this.repo.update(id, partial);
      if (!result.affected)
        throw new NotFoundException(`WorkOrder with ID ${id} not found.`);
      const updated = await this.repo.findOne({ where: { id } });
      if (!updated)
        throw new NotFoundException(`WorkOrder with ID ${id} not found.`);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repo.softDelete({ id });
      if (!res.affected)
        throw new NotFoundException(`WorkOrder with ID ${id} not found.`);
      return { message: `WorkOrder with ID ${id} successfully deleted.` };
    } catch (error) {
      throw error;
    }
  }
}
