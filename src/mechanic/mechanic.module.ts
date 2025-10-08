import { Module } from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { MechanicController } from './mechanic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mechanic } from './entities/mechanic.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { MechanicDomain } from './domain/mechanic.domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mechanic, Appointment, Customer, Workshop]),
  ], // <--- acá se registra el repo
  controllers: [MechanicController],
  providers: [MechanicService, MechanicDomain],
  exports: [MechanicService], // (opcional) por si otro módulo lo usa
})
export class MechanicModule {}
