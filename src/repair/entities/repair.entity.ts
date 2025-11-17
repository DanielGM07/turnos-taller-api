import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity()
export class Repair {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Vehicle) @JoinColumn() vehicle: Vehicle;

  @ManyToOne(() => ServiceEntity)
  @JoinColumn()
  service: ServiceEntity;

  @ManyToOne(() => Appointment)
  @JoinColumn()
  appointment?: Appointment;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) final_price: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
