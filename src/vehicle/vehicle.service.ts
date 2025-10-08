import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Repair } from 'src/repair/entities/repair.entity';
import { error } from 'console';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle) private readonly repo: Repository<Vehicle>,

    @InjectRepository(Repair) private readonly repairRepo: Repository<Repair>,
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

  async listRepairsByVehicle(
    vehicleId: string,
    opts?: { customerId?: string },
  ): Promise<Repair[]> {
    // Traemos el vehículo con su customer para validar pertenencia si hace falta
    const vehicle = await this.repo.findOne({
      where: { id: vehicleId },
      relations: ['customer'],
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found.`);
    }

    if (opts?.customerId && vehicle.customer?.id !== opts.customerId) {
      throw error;
    }

    // Buscamos repairs por relación vehicle
    return await this.repairRepo.find({
      where: { vehicle: { id: vehicleId } as any },
      relations: [
        'vehicle',
        'service',
        'appointment',
        'appointment.mechanic',
        'appointment.workshop',
      ],
      order: { created_at: 'DESC' as any },
    });
  }
}
