import { Test, TestingModule } from '@nestjs/testing';
import { MechanicWorkshopService } from './mechanic-workshop.service';

describe('MechanicWorkshopService', () => {
  let service: MechanicWorkshopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MechanicWorkshopService],
    }).compile();

    service = module.get<MechanicWorkshopService>(MechanicWorkshopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
