import { Module } from '@nestjs/common';
import { MechanicReviewService } from './mechanic-review.service';
import { MechanicReviewController } from './mechanic-review.controller';
import { MechanicReview } from './entities/mechanic-review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MechanicReview, Mechanic])], // <--- acá se registra el repo
  controllers: [MechanicReviewController],
  providers: [MechanicReviewService],
  exports: [MechanicReviewService], // (opcional) por si otro módulo lo usa
})
export class MechanicReviewModule {}
