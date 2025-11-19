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

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
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
}
