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
import { Appointment } from '../../appointment/entities/appointment.entity';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';

export enum WorkOrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

@Entity()
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Appointment, { nullable: false })
  @JoinColumn()
  appointment: Appointment;
  @ManyToOne(() => Mechanic, { nullable: false })
  @JoinColumn()
  mechanic: Mechanic;

  @Column()
  start_date: Date;

  @Column({ nullable: true })
  end_date?: Date;

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.OPEN,
  })
  status: WorkOrderStatus;

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
  @DeleteDateColumn() deleted_at?: Date;
}
