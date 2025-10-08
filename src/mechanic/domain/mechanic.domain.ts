import { Mechanic } from '../entities/mechanic.entity';
import { CreateMechanicDto } from '../dto/create-mechanic.dto';
import { UpdateMechanicDto } from '../dto/update-mechanic.dto';
import { Workshop } from '../../workshop/entities/workshop.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { UpdateAppointmentDto } from '../../appointment/dto/update-appointment.dto';
import { Customer } from '../../customer/entities/customer.entity';

type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'done'
  | 'cancelled';

export class MechanicDomain {
  // ===== Mechanic =====
  createMechanic(dto: CreateMechanicDto): Mechanic {
    const m = new Mechanic();
    Object.assign(m, dto);
    if (
      (dto as any).specialties &&
      typeof (dto as any).specialties === 'string'
    ) {
      (m as any).specialties = (dto as any).specialties
        .split(',')
        .map((s: string) => s.trim());
    }
    (m as any).created_at = new Date();
    (m as any).updated_at = new Date();
    return m;
  }

  updateMechanic(mechanic: Mechanic, dto: UpdateMechanicDto): Mechanic {
    const partial: any = { ...dto };
    if (partial.specialties && typeof partial.specialties === 'string') {
      partial.specialties = partial.specialties
        .split(',')
        .map((s: string) => s.trim());
    }
    Object.assign(mechanic, partial);
    (mechanic as any).updated_at = new Date();
    return mechanic;
  }

  // ===== Workshops (N–N) =====
  enrollWorkshop(mechanic: Mechanic, workshop: Workshop): Mechanic {
    const list = (mechanic as any).workshops ?? [];
    const already = list.some((w: Workshop) => w.id === workshop.id);
    if (!already) {
      (mechanic as any).workshops = [...list, workshop];
      (mechanic as any).updated_at = new Date();
    }
    return mechanic;
  }

  unenrollWorkshop(mechanic: Mechanic, workshopId: string): Mechanic {
    (mechanic as any).workshops = ((mechanic as any).workshops ?? []).filter(
      (w: Workshop) => w.id !== workshopId,
    );
    (mechanic as any).updated_at = new Date();
    return mechanic;
  }

  viewMyWorkshops(mechanic: Mechanic): Workshop[] {
    return (mechanic as any).workshops ?? [];
  }

  // ===== Appointments (propios) =====
  listMyAppointmentsInMemory(
    appointments: Appointment[],
    filter?: { status?: string; from?: string; to?: string },
  ): Appointment[] {
    let result = [...appointments];
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

  updateMyAppointment(
    appt: Appointment,
    dto: UpdateAppointmentDto,
  ): Appointment {
    const partial: any = { ...dto };
    if (dto.scheduled_at) partial.scheduled_at = new Date(dto.scheduled_at);
    Object.assign(appt, partial);
    (appt as any).updated_at = new Date();
    return appt;
  }

  confirmMyAppointment(appt: Appointment): Appointment {
    (appt as any).status = 'confirmed' as AppointmentStatus;
    (appt as any).updated_at = new Date();
    return appt;
  }

  startMyAppointment(appt: Appointment): Appointment {
    (appt as any).status = 'in_progress' as AppointmentStatus;
    (appt as any).updated_at = new Date();
    return appt;
  }

  completeMyAppointment(appt: Appointment): Appointment {
    (appt as any).status = 'done' as AppointmentStatus;
    (appt as any).updated_at = new Date();
    return appt;
  }

  cancelMyAppointment(appt: Appointment, note?: string): Appointment {
    (appt as any).status = 'cancelled' as AppointmentStatus;
    const base = (appt as any).notes ?? '';
    (appt as any).notes = note ? `${base}${base ? '\n' : ''}${note}` : base;
    (appt as any).updated_at = new Date();
    return appt;
  }

  // ===== Customers asignados (a partir de turnos) =====
  viewAssignedCustomersFromAppointments(appts: Appointment[]): Customer[] {
    const map = new Map<string, Customer>();
    for (const a of appts) {
      const c = (a as any).customer as Customer | undefined;
      if (c?.id) map.set(c.id, c);
    }
    return Array.from(map.values());
  }
}
