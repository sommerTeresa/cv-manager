import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { Education } from '../../modules/education/entities/education.entity';

@Injectable()
export class MatchCvIdEducationGuard implements CanActivate {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepo: Repository<Education>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { cvId, id } = req.params;
    if (!cvId || !id) {
      return true;
    }
    const education = await this.educationRepo.findOneBy({ id });
    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }
    if (education.cvId !== cvId) {
      throw new NotFoundException('Education does not belong to this CV');
    }
    return true;
  }
}
