import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])], // <--- acá se registra el repo
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService], // (opcional) por si otro módulo lo usa
})
export class AppointmentModule {}
