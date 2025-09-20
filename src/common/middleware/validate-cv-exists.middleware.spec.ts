import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';

import { CreateCvDto } from '../..//modules/cv/dto/create-cv.dto';
import { CV } from '../../modules/cv/entities/cv.entity';
import { Education } from '../../modules/education/entities/education.entity';
import { WorkExperience } from '../../modules/work-experience/entities/work-experience.entity';
import { ValidateCvExistsMiddleware } from './validate-cv-exists.middleware';

const createData: CreateCvDto = {
  name: 'Teresa Sommer',
  email: 'teresa@example.com',
  skills: ['JavaScript', 'TypeScript'],
};

describe('ValidateCvExistsMiddleware', () => {
  let middleware: ValidateCvExistsMiddleware;
  let repo: Repository<CV>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [CV, Education, WorkExperience],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([CV]),
      ],
      providers: [ValidateCvExistsMiddleware],
    }).compile();
    middleware = module.get<ValidateCvExistsMiddleware>(
      ValidateCvExistsMiddleware,
    );
    repo = module.get<Repository<CV>>(getRepositoryToken(CV));
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should throw if CV not found', async () => {
    const req = { params: { cvId: 'not-exist' } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();
    await expect(middleware.use(req, res, next)).rejects.toThrow();
  });

  it('should call next if CV exists', async () => {
    const created = await repo.save(createData);
    const req = { params: { cvId: created.id } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();
    await expect(middleware.use(req, res, next)).resolves.toBeUndefined();
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
});
