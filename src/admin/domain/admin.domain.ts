import { Admin } from '../entities/admin.entity';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { Workshop } from '../../workshop/entities/workshop.entity';
import { CreateWorkshopDto } from '../../workshop/dto/create-workshop.dto';
import { UpdateWorkshopDto } from '../../workshop/dto/update-workshop.dto';
import { Mechanic } from '../../mechanic/entities/mechanic.entity';

export class AdminDomain {
  // ===== Admin =====
  createAdmin(dto: CreateAdminDto): Admin {
    const admin = new Admin();
    Object.assign(admin, dto);
    (admin as any).created_at = new Date();
    (admin as any).updated_at = new Date();
    return admin;
  }

  updateAdmin(admin: Admin, dto: UpdateAdminDto): Admin {
    Object.assign(admin, dto);
    (admin as any).updated_at = new Date();
    return admin;
  }

  // ===== Workshops =====
  createWorkshop(dto: CreateWorkshopDto): Workshop {
    const ws = new Workshop();
    ws.name = dto.name;
    (ws as any).address = (dto as any).address ?? null;
    (ws as any).phone = (dto as any).phone ?? null;
    (ws as any).notes = (dto as any).notes ?? null;
    (ws as any).created_at = new Date();
    (ws as any).updated_at = new Date();
    return ws;
  }

  updateWorkshop(workshop: Workshop, dto: UpdateWorkshopDto): Workshop {
    Object.assign(workshop, dto);
    (workshop as any).updated_at = new Date();
    return workshop;
  }

  // Helpers de relación con mecánicos
  addMechanicToWorkshop(workshop: Workshop, mechanic: Mechanic): Workshop {
    const list = workshop.mechanics ?? [];
    const already = list.some((m) => m.id === mechanic.id);
    if (!already) {
      workshop.mechanics = [...list, mechanic];
      (workshop as any).updated_at = new Date();
    }
    return workshop;
  }

  removeMechanicFromWorkshop(workshop: Workshop, mechanicId: string): Workshop {
    workshop.mechanics = (workshop.mechanics ?? []).filter(
      (m) => m.id !== mechanicId,
    );
    (workshop as any).updated_at = new Date();
    return workshop;
  }

  // Reads puros (no mutan)
  viewWorkshops(workshops: Workshop[]): Workshop[] {
    return workshops;
  }
  viewMechanics(mechanics: Mechanic[]): Mechanic[] {
    return mechanics;
  }
  viewWorkshop(workshop: Workshop): Workshop {
    return workshop;
  }
  viewMechanic(mechanic: Mechanic): Mechanic {
    return mechanic;
  }
}
