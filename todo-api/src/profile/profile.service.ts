import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { Profile } from './entities/profile.entity.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private repo: Repository<Profile>,
  ) {}

  create(dto: CreateProfileDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const profile = await this.repo.findOneBy({ id });
    if (!profile) throw new NotFoundException(`Profile ${id} not found`);
    return profile;
  }

  async update(id: number, dto: UpdateProfileDto) {
    const profile = await this.findOne(id);
    return this.repo.save(this.repo.merge(profile, dto));
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Profile ${id} not found`);
  }
}
