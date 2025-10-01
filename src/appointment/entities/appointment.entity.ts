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
import { ServiceEntity } from '../../service/entities/service.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Workshop } from '../../workshop/entities/workshop.entity';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @Column()
  service_id: string;

  @ManyToOne(() => Customer, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  customer_id: string;

  @ManyToOne(() => Mechanic, { nullable: false })
  @JoinColumn({ name: 'mechanic_id' })
  mechanic: Mechanic;

  @Column()
  mechanic_id: string;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  vehicle_id?: string;

  @ManyToOne(() => Workshop, { nullable: false })
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  @Column()
  workshop_id: string;

  @Column()
  scheduled_at: Date;

  @Column({ nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
