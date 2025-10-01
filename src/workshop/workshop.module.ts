import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';
import { Workshop } from './entities/workshop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Workshop])], // <--- acá se registra el repo
  controllers: [WorkshopController],
  providers: [WorkshopService],
  exports: [WorkshopService], // (opcional) por si otro módulo lo usa
})
export class WorkshopModule {}
