// mechanic-review/entities/mechanic-review.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity()
@Unique(['mechanic', 'customer', 'appointment']) // evita duplicados por turno
export class MechanicReview {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Mechanic, { nullable: false })
  @JoinColumn()
  mechanic: Mechanic;

  @ManyToOne(() => Customer, { nullable: false })
  @JoinColumn()
  customer: Customer;

  @ManyToOne(() => Appointment, { nullable: true })
  @JoinColumn()
  appointment?: Appointment; // opcional pero recomendable

  @Column({ type: 'int' })
  rating: number; // 1–10

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
