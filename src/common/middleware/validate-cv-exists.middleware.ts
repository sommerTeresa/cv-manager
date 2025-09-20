import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';

import { CV } from '../../modules/cv/entities/cv.entity';

@Injectable()
export class ValidateCvExistsMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(CV)
    private readonly cvRepository: Repository<CV>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const cvId = req.params.cvId;
    if (!cvId) {
      throw new NotFoundException('cvId is required in route');
    }
    const cv = await this.cvRepository.findOneBy({ id: cvId });
    if (!cv) {
      throw new NotFoundException(`CV with ID ${cvId} not found`);
    }
    next();
  }
}
