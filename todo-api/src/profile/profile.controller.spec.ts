import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileService } from './profile.service.js';
import { Profile } from './entities/profile.entity.js';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [ProfileService, { provide: getRepositoryToken(Profile), useValue: {} }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
