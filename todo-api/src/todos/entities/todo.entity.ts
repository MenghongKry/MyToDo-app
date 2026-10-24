import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 200 }) title: string;
  @Column({ default: 'TODO' }) status: string;
  // Deleting a user also deletes their todos.
  // Relation<> stops an ESM circular-import crash between User and Todo.
  @ManyToOne(() => User, (u) => u.todos, { onDelete: 'CASCADE' }) owner: Relation<User>;
  @Column() ownerId: string;
  @CreateDateColumn() createdAt: Date;
}
