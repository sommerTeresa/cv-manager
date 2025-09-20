import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { validateDateOrder } from '../../utils/date-validation.util';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Education } from './entities/education.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  async findAll(
    filters?: Partial<FindOptionsWhere<Education>>,
  ): Promise<Education[]> {
    return this.educationRepository.find({
      where: filters || {},
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Education> {
    const education = await this.educationRepository.findOneBy({ id });
    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }
    return education;
  }

  async create(data: CreateEducationDto): Promise<Education> {
    validateDateOrder(data.startDate, data.endDate);
    const education = this.educationRepository.create(data);
    return this.educationRepository.save(education);
  }

  async update(id: string, data: UpdateEducationDto): Promise<Education> {
    validateDateOrder(data.startDate, data.endDate);
    const education = await this.educationRepository.preload({
      id,
      ...data,
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    return this.educationRepository.save(education);
  }

  async remove(id: string): Promise<void> {
    const result = await this.educationRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Education with ID ${id} not found`);
  }
}
