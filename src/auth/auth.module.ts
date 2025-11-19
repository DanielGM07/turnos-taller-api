import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Admin } from '../admin/entities/admin.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';
import { Customer } from '../customer/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Mechanic, Customer])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
