import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';

// 👇 importa los módulos que EXPORTAN los servicios que inyecta AdminService
import { WorkshopModule } from 'src/workshop/workshop.module';
import { MechanicModule } from 'src/mechanic/mechanic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    forwardRef(() => WorkshopModule), // <-- hace disponible WorkshopService
    forwardRef(() => MechanicModule), // <-- hace disponible MechanicService
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
