import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Workshop } from '../../workshop/entities/workshop.entity';

export enum MechanicStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

@Entity()
export class Mechanic {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() first_name: string;
  @Column() last_name: string;
  @Column() birth_date: Date;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[]; // e.g. "Suspensión,Frenos"

  @Column({
    type: 'enum',
    enum: MechanicStatus,
    default: MechanicStatus.ENABLED,
  })
  status: MechanicStatus;

  @ManyToMany(() => Workshop, (w) => w.mechanics)
  @JoinTable({
    name: 'mechanic_workshop', // tabla intermedia implícita
    joinColumn: { name: 'mechanic_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'workshop_id', referencedColumnName: 'id' },
  })
  workshops: Workshop[];

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
  @DeleteDateColumn() deleted_at?: Date;
}
