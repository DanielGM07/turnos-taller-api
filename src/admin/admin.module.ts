import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])], // <--- acá se registra el repo
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService], // (opcional) por si otro módulo lo usa
})
export class AdminModule {}
