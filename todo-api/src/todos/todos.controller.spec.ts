import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodosService } from './todos.service.js';
import { Todo } from './entities/todo.entity.js';

describe('TodosController', () => {
  let controller: TodosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [TodosService, { provide: getRepositoryToken(Todo), useValue: {} }],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
