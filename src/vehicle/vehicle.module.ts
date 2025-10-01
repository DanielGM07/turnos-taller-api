import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])], // <--- acá se registra el repo
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService], // (opcional) por si otro módulo lo usa
})
export class VehicleModule {}
