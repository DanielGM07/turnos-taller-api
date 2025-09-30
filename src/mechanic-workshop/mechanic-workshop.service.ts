import { Injectable } from '@nestjs/common';
import { CreateMechanicWorkshopDto } from './dto/create-mechanic-workshop.dto';
import { UpdateMechanicWorkshopDto } from './dto/update-mechanic-workshop.dto';

@Injectable()
export class MechanicWorkshopService {
  create(createMechanicWorkshopDto: CreateMechanicWorkshopDto) {
    return 'This action adds a new mechanicWorkshop';
  }

  findAll() {
    return `This action returns all mechanicWorkshop`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mechanicWorkshop`;
  }

  update(id: number, updateMechanicWorkshopDto: UpdateMechanicWorkshopDto) {
    return `This action updates a #${id} mechanicWorkshop`;
  }

  remove(id: number) {
    return `This action removes a #${id} mechanicWorkshop`;
  }
}
