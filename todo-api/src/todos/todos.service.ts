import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { Todo } from './entities/todo.entity.js';

// Every query filters by ownerId, so one user can never read or edit another user's todo.
@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>,
  ) {}

  findAll(ownerId: string) {
    return this.repo.find({ where: { ownerId }, order: { createdAt: 'ASC' } });
  }

  create(ownerId: string, dto: CreateTodoDto) {
    return this.repo.save(this.repo.create({ ...dto, ownerId }));
  }

  // Someone else's todo gives 404 too, so we don't reveal that it exists.
  async findOne(ownerId: string, id: string) {
    const todo = await this.repo.findOneBy({ id, ownerId });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }

  // Load the row first so a missing id gives 404, then save only the changed fields.
  async update(ownerId: string, id: string, dto: UpdateTodoDto) {
    const todo = await this.findOne(ownerId, id);
    return this.repo.save(this.repo.merge(todo, dto));
  }

  async remove(ownerId: string, id: string) {
    const result = await this.repo.delete({ id, ownerId });
    if (result.affected === 0) throw new NotFoundException(`Todo ${id} not found`);
  }
}
