import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { WorkExperience } from '../../modules/work-experience/entities/work-experience.entity';

@Injectable()
export class MatchCvIdWorkExperienceGuard implements CanActivate {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperienceRepo: Repository<WorkExperience>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { cvId, id } = req.params;
    if (!cvId || !id) {
      return true;
    }
    const workExperience = await this.workExperienceRepo.findOneBy({ id });
    if (!workExperience) {
      throw new NotFoundException(`WorkExperience with ID ${id} not found`);
    }
    if (workExperience.cvId !== cvId) {
      throw new NotFoundException('WorkExperience does not belong to this CV');
    }
    return true;
  }
}
