import { Module } from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { MechanicController } from './mechanic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mechanic } from './entities/mechanic.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mechanic, Workshop])], // <--- acá se registra el repo
  controllers: [MechanicController],
  providers: [MechanicService],
  exports: [MechanicService], // (opcional) por si otro módulo lo usa
})
export class MechanicModule {}
