import { Module } from '@nestjs/common';
import { WorkOrderService } from './work-order.service';
import { WorkOrderController } from './work-order.controller';
import { WorkOrder } from './entities/work-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder])], // <--- acá se registra el repo
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
  exports: [WorkOrderService], // (opcional) por si otro módulo lo usa
})
export class WorkOrderModule {}
