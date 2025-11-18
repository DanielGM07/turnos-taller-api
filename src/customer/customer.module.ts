import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

import { Customer } from './entities/customer.entity';
import { ServiceEntity } from 'src/service/entities/service.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { MechanicReview } from 'src/mechanic-review/entities/mechanic-review.entity';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';

// módulos que exportan los services que inyectás en CustomerService
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { MechanicReviewModule } from 'src/mechanic-review/mechanic-review.module';
import { Workshop } from 'src/workshop/entities/workshop.entity';
import { CustomerDomain } from './domain/customer.domain';

@Module({
  imports: [
    // 👇 repos que CustomerService inyecta en el constructor
    TypeOrmModule.forFeature([
      Customer,
      ServiceEntity,
      Appointment, // <- FALTABA (causaba el error)
      Vehicle,
      MechanicReview,
      Mechanic,
      Workshop,
    ]),

    // 👇 services externos usados por CustomerService
    forwardRef(() => VehicleModule), // exporta VehicleService
    forwardRef(() => MechanicReviewModule), // exporta MechanicReviewService
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerDomain],
  exports: [CustomerService],
})
export class CustomerModule {}
