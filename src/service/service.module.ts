import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceEntity } from './entities/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])], // <--- acá se registra el repo
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService], // (opcional) por si otro módulo lo usa
})
export class ServiceModule {}
