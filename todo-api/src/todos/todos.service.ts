import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { Todo } from './entities/todo.entity.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  create(dto: CreateTodoDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async findOne(id: number) {
    const todo = await this.repo.findOneBy({ id });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }

  // Load the row first so a missing id gives 404, then save only the changed fields.
  async update(id: number, dto: UpdateTodoDto) {
    const todo = await this.findOne(id);
    return this.repo.save(this.repo.merge(todo, dto));
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Todo ${id} not found`);
  }
}
