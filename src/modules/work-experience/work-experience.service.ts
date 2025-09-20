import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { validateDateOrder } from '../../utils/date-validation.util';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';
import { WorkExperience } from './entities/work-experience.entity';

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepository: Repository<WorkExperience>,
  ) {}

  async findAll(
    filters?: Partial<FindOptionsWhere<WorkExperience>>,
  ): Promise<WorkExperience[]> {
    return this.workExperienceRepository.find({
      where: filters || {},
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<WorkExperience> {
    const workExperience = await this.workExperienceRepository.findOneBy({
      id,
    });
    if (!workExperience) {
      throw new NotFoundException(`WorkExperience with ID ${id} not found`);
    }
    return workExperience;
  }

  async create(data: CreateWorkExperienceDto): Promise<WorkExperience> {
    validateDateOrder(data.startDate, data.endDate);
    const workExperience = this.workExperienceRepository.create(data);
    return this.workExperienceRepository.save(workExperience);
  }

  async update(
    id: string,
    data: UpdateWorkExperienceDto,
  ): Promise<WorkExperience> {
    validateDateOrder(data.startDate, data.endDate);
    await this.findOne(id);
    const workExp = await this.workExperienceRepository.preload({
      id,
      ...data,
    });

    if (!workExp) {
      throw new NotFoundException(`WorkExperience with ID ${id} not found`);
    }

    return this.workExperienceRepository.save(workExp);
  }

  async remove(id: string): Promise<void> {
    const result = await this.workExperienceRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`WorkExperience with ID ${id} not found`);
  }
}
