import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repair } from 'src/repair/entities/repair.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Repair])], // ⬅️ agregamos Repair
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService], // (opcional) por si otro módulo lo usa
})
export class VehicleModule {}
