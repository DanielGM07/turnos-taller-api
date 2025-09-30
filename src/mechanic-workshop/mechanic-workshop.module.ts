import { Module } from '@nestjs/common';
import { MechanicWorkshopService } from './mechanic-workshop.service';
import { MechanicWorkshopController } from './mechanic-workshop.controller';

@Module({
  controllers: [MechanicWorkshopController],
  providers: [MechanicWorkshopService],
})
export class MechanicWorkshopModule {}
