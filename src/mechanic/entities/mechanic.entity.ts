import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum MechanicStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

@Entity()
export class Mechanic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() first_name: string;
  @Column() last_name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[]; // e.g. "Suspensión,Frenos"

  @Column({
    type: 'enum',
    enum: MechanicStatus,
    default: MechanicStatus.ENABLED,
  })
  status: MechanicStatus;

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
  @DeleteDateColumn() deleted_at?: Date;
}
