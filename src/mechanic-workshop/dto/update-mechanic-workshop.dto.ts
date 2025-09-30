import { PartialType } from '@nestjs/swagger';
import { CreateMechanicWorkshopDto } from './create-mechanic-workshop.dto';

export class UpdateMechanicWorkshopDto extends PartialType(CreateMechanicWorkshopDto) {}
