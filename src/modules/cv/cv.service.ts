import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { CV } from './entities/cv.entity';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CV)
    private readonly cvRepository: Repository<CV>,
  ) {}

  async findAll(): Promise<CV[]> {
    return this.cvRepository.find({
      relations: ['educations', 'workExperiences'],
    });
  }

  async findOne(id: string): Promise<CV> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['educations', 'workExperiences'],
    });
    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }
    return cv;
  }

  async create(data: CreateCvDto): Promise<CV> {
    const cv: CV = this.cvRepository.create(data);
    return this.cvRepository.save(cv);
  }

  async update(id: string, data: UpdateCvDto): Promise<CV> {
    const cv = await this.cvRepository.preload({
      id,
      ...data,
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }

    return this.cvRepository.save(cv);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cvRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }
  }
}
