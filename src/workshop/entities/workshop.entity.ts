import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';

@Entity()
export class Workshop {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() name: string;
  @Column() address: string;
  @Column({ type: 'time' }) opens_at: string;
  @Column({ type: 'time' }) closes_at: string;

  @ManyToMany(() => Mechanic, (m) => m.workshops)
  mechanics: Mechanic[];

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
  @DeleteDateColumn() deleted_at?: Date;
}
