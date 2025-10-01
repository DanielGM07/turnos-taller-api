import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
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
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    try {
      const result = await this.adminRepository.update(id, updateAdminDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      const admin = await this.adminRepository.findOneBy({ id });
      if (!admin) {
        throw new NotFoundException(
          `Admin with ID ${id} not found after update`,
        );
      }

      return admin;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.adminRepository.softDelete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      return { message: `Admin with ID ${id} successfully deleted` };
    } catch (error) {
      throw error;
    }
  }
}
