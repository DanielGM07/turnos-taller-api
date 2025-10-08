import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { CreateVehicleDto } from '../../vehicle/dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../../vehicle/dto/update-vehicle.dto';

import { Appointment } from '../../appointment/entities/appointment.entity';
import { CreateAppointmentDto } from '../../appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../../appointment/dto/update-appointment.dto';

import { Workshop } from '../../workshop/entities/workshop.entity';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';
import { ServiceEntity } from '../../service/entities/service.entity';

import { MechanicReview } from '../../mechanic-review/entities/mechanic-review.entity';
import { CreateMechanicReviewDto } from '../../mechanic-review/dto/create-mechanic-review.dto';

type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'done'
  | 'cancelled';

export class CustomerDomain {
  // ========= Customer =========
  createCustomer(dto: CreateCustomerDto): Customer {
    const c = new Customer();
    Object.assign(c, dto);
    (c as any).created_at = new Date();
    (c as any).updated_at = new Date();
    return c;
  }

  updateCustomer(customer: Customer, dto: UpdateCustomerDto): Customer {
    Object.assign(customer, dto);
    (customer as any).updated_at = new Date();
    return customer;
  }

  // ========= Vehicles =========
  createVehicle(owner: Customer, dto: CreateVehicleDto): Vehicle {
    const v = new Vehicle();
    Object.assign(v, dto);
    (v as any).customer = owner;
    (v as any).created_at = new Date();
    (v as any).updated_at = new Date();
    return v;
  }

  updateVehicle(vehicle: Vehicle, dto: UpdateVehicleDto): Vehicle {
    Object.assign(vehicle, dto);
    (vehicle as any).updated_at = new Date();
    return vehicle;
  }

  // ========= Appointments =========
  createAppointment(
    customer: Customer,
    dto: CreateAppointmentDto,
    refs: {
      service: ServiceEntity;
      workshop: Workshop;
      mechanic?: Mechanic | null;
      vehicle?: Vehicle | null;
    },
  ): Appointment {
    const a = new Appointment();
    (a as any).customer = customer;
    (a as any).service = refs.service;
    (a as any).workshop = refs.workshop;
    if (refs.mechanic) (a as any).mechanic = refs.mechanic;
    if (refs.vehicle) (a as any).vehicle = refs.vehicle;

    (a as any).scheduled_at = new Date(dto.scheduled_at);
    (a as any).duration_minutes = (dto as any).duration_minutes ?? null;
    (a as any).status = (dto as any).status ?? ('pending' as AppointmentStatus);
    (a as any).notes = (dto as any).notes ?? null;

    (a as any).created_at = new Date();
    (a as any).updated_at = new Date();
    return a;
  }

  updateAppointment(appt: Appointment, dto: UpdateAppointmentDto): Appointment {
    const partial: any = { ...dto };
    if (dto.scheduled_at) partial.scheduled_at = new Date(dto.scheduled_at);
    Object.assign(appt, partial);
    (appt as any).updated_at = new Date();
    return appt;
  }

  confirmAppointment(appt: Appointment): Appointment {
    (appt as any).status = 'confirmed' as AppointmentStatus;
    (appt as any).updated_at = new Date();
    return appt;
  }

  startAppointment(appt: Appointment): Appointment {
    (appt as any).status = 'in_progress' as AppointmentStatus;
    (appt as any).updated_at = new Date();
    return appt;
  }

  completeAppointment(appt: Appointment): Appointment {
    (appt as any).status = 'done' as AppointmentStatus;
    (appt as any).updated_at = new Date();
    return appt;
  }

  cancelAppointment(appt: Appointment, reason?: string): Appointment {
    if ((appt as any).status === 'cancelled') {
      throw new Error('Appointment already cancelled');
    }
    (appt as any).status = 'cancelled' as AppointmentStatus;
    const base = (appt as any).notes ?? '';
    (appt as any).notes = reason ? `${base}${base ? '\n' : ''}${reason}` : base;
    (appt as any).updated_at = new Date();
    return appt;
  }

  rescheduleAppointment(
    appt: Appointment,
    newDateISO: string,
    who: string,
  ): Appointment {
    if ((appt as any).status === 'cancelled') {
      throw new Error('Cannot reschedule a cancelled appointment');
    }
    (appt as any).status = 'pending' as AppointmentStatus;
    (appt as any).scheduled_at = new Date(newDateISO);
    const base = (appt as any).notes ?? '';
    (appt as any).notes = `${base}${base ? '\n' : ''}Rescheduled by: ${who}`;
    (appt as any).updated_at = new Date();
    return appt;
  }

  // ========= Reviews =========
  createMechanicReview(
    customer: Customer,
    dto: CreateMechanicReviewDto,
    refs: { mechanic: Mechanic; appointment?: Appointment | null },
  ): MechanicReview {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (refs.appointment) {
      const appt = refs.appointment as any;
      if (appt.customer?.id !== customer.id) {
        throw new Error('Appointment does not belong to this customer');
      }
      if (appt.mechanic?.id !== refs.mechanic.id) {
        throw new Error('Appointment mechanic does not match review mechanic');
      }
    }

    const r = new MechanicReview();
    (r as any).customer = customer;
    (r as any).mechanic = refs.mechanic;
    if (refs.appointment) (r as any).appointment = refs.appointment;
    (r as any).rating = dto.rating;
    (r as any).comment = dto.comment ?? null;
    (r as any).created_at = new Date();
    (r as any).updated_at = new Date();
    return r;
  }

  // ========= Reads =========
  viewCustomer(customer: Customer): Customer {
    return customer;
  }
  viewCustomers(list: Customer[]): Customer[] {
    return list;
  }
  viewCustomerAppointments(customer: Customer): Appointment[] {
    return (customer as any).appointments ?? [];
  }
  viewCustomerVehicles(customer: Customer): Vehicle[] {
    return (customer as any).vehicles ?? [];
  }

  filterAppointmentsInMemory(
    appts: Appointment[],
    filter?: { status?: string; from?: string; to?: string },
  ): Appointment[] {
    let result = [...appts];
    if (filter?.status)
      result = result.filter((a) => (a as any).status === filter.status);
    if (filter?.from || filter?.to) {
      const from = filter.from ? new Date(filter.from) : new Date('1970-01-01');
      const to = filter.to ? new Date(filter.to) : new Date('2999-12-31');
      result = result.filter((a) => {
        const d = new Date((a as any).scheduled_at);
        return d >= from && d <= to;
      });
    }
    return result.sort(
      (a, b) =>
        new Date((b as any).scheduled_at).getTime() -
        new Date((a as any).scheduled_at).getTime(),
    );
  }
}
