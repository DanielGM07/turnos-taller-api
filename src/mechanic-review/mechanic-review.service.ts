// mechanic-review/mechanic-review.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MechanicReview } from './entities/mechanic-review.entity';
import { CreateMechanicReviewDto } from './dto/create-mechanic-review.dto';
import { UpdateMechanicReviewDto } from './dto/update-mechanic-review.dto';
import { Mechanic } from '../mechanic/entities/mechanic.entity';

@Injectable()
export class MechanicReviewService {
  constructor(
    @InjectRepository(MechanicReview)
    private readonly repo: Repository<MechanicReview>,
    @InjectRepository(Mechanic)
    private readonly mechRepo: Repository<Mechanic>,
  ) {}

  async create(dto: CreateMechanicReviewDto): Promise<MechanicReview> {
    try {
      const entity = this.repo.create({
        rating: dto.rating,
        comment: dto.comment,
        mechanic: { id: dto.mechanic_id } as any,
        customer: { id: dto.customer_id } as any,
        appointment: dto.appointment_id
          ? ({ id: dto.appointment_id } as any)
          : undefined,
      });
      const saved = await this.repo.save(entity);
      await this.recalculateAggregates(dto.mechanic_id);
      return saved;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<MechanicReview[]> {
    try {
      return await this.repo.find({
        relations: ['mechanic', 'customer', 'appointment'],
        order: { created_at: 'DESC' as any },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<MechanicReview> {
    try {
      const review = await this.repo.findOne({
        where: { id },
        relations: ['mechanic', 'customer', 'appointment'],
      });
      if (!review) throw new NotFoundException(`Review ${id} not found.`);
      return review;
    } catch (error) {
      throw error;
    }
  }

  // 👇 NUEVO: todas las calificaciones de un mecánico
  async listByMechanic(mechanicId: string): Promise<MechanicReview[]> {
    // opcional: asegurarse de que existe el mecánico
    const mech = await this.mechRepo.findOne({ where: { id: mechanicId } });
    if (!mech) throw new NotFoundException(`Mechanic ${mechanicId} not found`);

    return await this.repo.find({
      where: { mechanic: { id: mechanicId } as any },
      relations: ['mechanic', 'customer', 'appointment'],
      order: { created_at: 'DESC' as any },
    });
  }

  async update(
    id: string,
    dto: UpdateMechanicReviewDto,
  ): Promise<MechanicReview> {
    try {
      const result = await this.repo.update(id, {
        rating: dto.rating,
        comment: dto.comment,
      } as any);
      if (!result.affected)
        throw new NotFoundException(`Review ${id} not found.`);

      const updated = await this.repo.findOne({
        where: { id },
        relations: ['mechanic'],
      });
      if (!updated) throw new NotFoundException(`Review ${id} not found.`);

      await this.recalculateAggregates(updated.mechanic.id);
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const review = await this.repo.findOne({
        where: { id },
        relations: ['mechanic'],
      });
      if (!review) throw new NotFoundException(`Review ${id} not found.`);
      await this.repo.softDelete({ id });
      await this.recalculateAggregates(review.mechanic.id);
      return { message: 'Review deleted.' };
    } catch (error) {
      throw error;
    }
  }

  private async recalculateAggregates(mechanicId: string) {
    const result = await this.repo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(1)', 'cnt')
      .where('r.mechanicId = :mechanicId', { mechanicId })
      .andWhere('r.deleted_at IS NULL')
      .getRawOne<{ avg: string | null; cnt: string | null }>();

    const avgNum = Number(result?.avg ?? 0);
    const cntNum = Number(result?.cnt ?? 0);

    await this.mechRepo.update(mechanicId, {
      average_rating: avgNum.toFixed(1), // p.ej. 7.3 / 10.0
      ratings_count: cntNum,
    } as any);
  }
}
