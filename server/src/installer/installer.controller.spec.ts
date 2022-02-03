import { Test, TestingModule } from '@nestjs/testing';
import { InstallerController } from './installer.controller';

describe('InstallerController', () => {
  let controller: InstallerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstallerController],
    }).compile();

    controller = module.get<InstallerController>(InstallerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
