import { Test, TestingModule } from '@nestjs/testing';
import { MechanicWorkshopController } from './mechanic-workshop.controller';
import { MechanicWorkshopService } from './mechanic-workshop.service';

describe('MechanicWorkshopController', () => {
  let controller: MechanicWorkshopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MechanicWorkshopController],
      providers: [MechanicWorkshopService],
    }).compile();

    controller = module.get<MechanicWorkshopController>(MechanicWorkshopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
