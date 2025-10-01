import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle) private readonly repo: Repository<Vehicle>,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    try {
      const entity = this.repo.create({
        ...dto,
        customer: { id: dto.customer_id } as any,
      });
      return await this.repo.save(entity);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Vehicle[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Vehicle> {
    try {
      const found = await this.repo.findOne({ where: { id } });
      if (!found)
        throw new NotFoundException(`Vehicle with ID ${id} not found.`);
      return found;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    try {
      const result = await this.repo.update(id, dto as any);
      if (result.affected === 0)
        throw new NotFoundException(`Vehicle with ID ${id} not found.`);
      const updated = await this.repo.findOne({ where: { id } });
      if (!updated)
        throw new NotFoundException(`Vehicle with ID ${id} not found.`);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const res = await this.repo.softDelete({ id });
      if (!res.affected)
        throw new NotFoundException(`Vehicle with ID ${id} not found.`);
      return { message: `Vehicle with ID ${id} successfully deleted.` };
    } catch (error) {
      throw error;
    }
  }
}
