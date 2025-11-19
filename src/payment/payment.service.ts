import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment.dto';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: dto.appointment_id },
      relations: ['mechanic'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Evitar dos pagos para el mismo turno
    const existing = await this.paymentRepo.findOne({
      where: { appointment_id: appointment.id },
    });
    if (existing) {
      throw new BadRequestException(
        'Payment already exists for this appointment',
      );
    }

    // amount_total: viene del dto o, si no viene, usamos appointment.final_price
    let amountTotal: number | null = null;

    if (dto.amount_total !== undefined) {
      amountTotal = Number(dto.amount_total);
    } else if (
      (appointment as any).final_price !== undefined &&
      (appointment as any).final_price !== null
    ) {
      amountTotal = Number((appointment as any).final_price);
    }

    if (amountTotal === null || Number.isNaN(amountTotal)) {
      throw new BadRequestException(
        'amount_total is required (either in dto or appointment.final_price)',
      );
    }

    // Comisión del mecánico
    const mechanic: any = appointment.mechanic;
    const commissionPercentage: number = Number(
      mechanic?.commission_percentage ?? 0,
    );

    const mechanicCommissionAmount = (amountTotal * commissionPercentage) / 100;

    const payment = this.paymentRepo.create({
      appointment,
      appointment_id: appointment.id,
      amount_total: amountTotal.toFixed(2),
      mechanic_commission_amount: mechanicCommissionAmount.toFixed(2),
      method: dto.method, // si viene undefined, agarra el default de la entity
      status: dto.status ?? PaymentStatus.PAID,
      notes: dto.notes,
    });

    return this.paymentRepo.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({
      relations: ['appointment'],
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['appointment'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updateStatus(
    id: string,
    dto: UpdatePaymentStatusDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = dto.status;
    return this.paymentRepo.save(payment);
  }

  async remove(id: string): Promise<void> {
    await this.paymentRepo.softDelete(id);
  }
}
