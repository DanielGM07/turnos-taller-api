import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Admin } from '../admin/entities/admin.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';
import { Customer } from '../customer/entities/customer.entity';
import { LoginDto } from './dto/login.dto';
import { AuthRole } from './auth-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,

    @InjectRepository(Mechanic)
    private readonly mechanicRepo: Repository<Mechanic>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    // 1) Admin
    const admin = await this.adminRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'first_name', 'last_name'],
    });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      return {
        id: admin.id,
        role: AuthRole.ADMIN,
        first_name: admin.first_name,
        last_name: admin.last_name,
      };
    }

    // 2) Mechanic
    const mechanic = await this.mechanicRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'first_name', 'last_name'],
    });

    if (mechanic && (await bcrypt.compare(password, mechanic.password))) {
      return {
        id: mechanic.id,
        role: AuthRole.MECHANIC,
        first_name: mechanic.first_name,
        last_name: mechanic.last_name,
      };
    }

    // 3) Customer
    const customer = await this.customerRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'first_name', 'last_name'],
    });

    if (customer && (await bcrypt.compare(password, customer.password))) {
      return {
        id: customer.id,
        role: AuthRole.CUSTOMER,
        first_name: customer.first_name,
        last_name: customer.last_name,
      };
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }
}
