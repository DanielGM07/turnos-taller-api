import { Module } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { Repair } from './entities/repair.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Repair])], // <--- acá se registra el repo
  controllers: [RepairController],
  providers: [RepairService],
  exports: [RepairService], // (opcional) por si otro módulo lo usa
})
export class RepairModule {}
