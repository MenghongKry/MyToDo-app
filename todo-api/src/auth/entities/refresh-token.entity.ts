import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid') id: string;
  // We never store the real token, only its SHA-256 hash (like a password).
  @Column({ unique: true }) tokenHash: string;
  @Column() expiresAt: Date;
  @Column({ default: false }) revoked: boolean;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user: Relation<User>;
  @Column() userId: string;
  @CreateDateColumn() createdAt: Date;
}
