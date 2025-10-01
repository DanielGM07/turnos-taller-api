import { Module } from '@nestjs/common';
import { MechanicReviewService } from './mechanic-review.service';
import { MechanicReviewController } from './mechanic-review.controller';
import { MechanicReview } from './entities/mechanic-review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MechanicReview])], // <--- acá se registra el repo
  controllers: [MechanicReviewController],
  providers: [MechanicReviewService],
  exports: [MechanicReviewService], // (opcional) por si otro módulo lo usa
})
export class MechanicReviewModule {}
