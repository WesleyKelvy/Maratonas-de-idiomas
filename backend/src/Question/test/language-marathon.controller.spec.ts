import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from '../question.controller';
import { StatsService } from '../question.service';

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [StatsService],
    }).compile();

    controller = module.get<StatsController>(StatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
