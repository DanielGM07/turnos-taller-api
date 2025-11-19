import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Workshop } from '../../workshop/entities/workshop.entity';
import * as bcrypt from 'bcrypt';

export enum MechanicStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

@Entity()
export class Mechanic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  birth_date: Date;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[];

  @Column({
    type: 'enum',
    enum: MechanicStatus,
    default: MechanicStatus.ENABLED,
  })
  status: MechanicStatus;

  @ManyToMany(() => Workshop, (w) => w.mechanics)
  @JoinTable({
    name: 'mechanic_workshop',
    joinColumn: { name: 'mechanic_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'workshop_id', referencedColumnName: 'id' },
  })
  workshops: Workshop[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  commission_percentage: number; // ej: "30.00" = 30%

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  average_rating: string;

  @Column({ type: 'int', default: 0 })
  ratings_count: number;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @BeforeInsert()
  async hashPasswordInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordUpdate() {
    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
