// src/admin/admin.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';

import { WorkshopModule } from 'src/workshop/workshop.module';
import { MechanicModule } from 'src/mechanic/mechanic.module';

// 👇 ENTIDADES para métricas
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { MechanicReview } from 'src/mechanic-review/entities/mechanic-review.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Appointment,
      MechanicReview,
      Customer,
      Vehicle,
      ServiceEntity,
      Payment,
      Mechanic,
      Workshop,
    ]),
    forwardRef(() => WorkshopModule),
    forwardRef(() => MechanicModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
