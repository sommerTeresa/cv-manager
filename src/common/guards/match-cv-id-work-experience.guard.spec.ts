import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CV } from '../../modules/cv/entities/cv.entity';
import { Education } from '../../modules/education/entities/education.entity';
import { WorkExperience } from '../../modules/work-experience/entities/work-experience.entity';
import { MatchCvIdWorkExperienceGuard } from './match-cv-id-work-experience.guard';

describe('MatchCvIdWorkExperienceGuard', () => {
  let guard: MatchCvIdWorkExperienceGuard;
  let repo: Repository<WorkExperience>;
  let createdCV: CV;
  let createdWorkExperience: WorkExperience;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [CV, WorkExperience, Education],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([CV, WorkExperience]),
      ],
      providers: [MatchCvIdWorkExperienceGuard],
    }).compile();
    guard = module.get<MatchCvIdWorkExperienceGuard>(
      MatchCvIdWorkExperienceGuard,
    );
    repo = module.get<Repository<WorkExperience>>(
      getRepositoryToken(WorkExperience),
    );

    const cvRepo = module.get<Repository<CV>>(getRepositoryToken(CV));

    createdCV = await cvRepo.save({
      name: 'Teresa Sommer',
      email: 'teresa@example.com',
      skills: ['JavaScript', 'TypeScript'],
    });
    createdWorkExperience = await repo.save({
      position: 'Software Engineer',
      company: 'Acme Corp',
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      cvId: createdCV.id,
    });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw if WorkExperience not found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: (): { params: { cvId: string; id: string } } => ({
          params: { cvId: createdCV.id, id: 'w-404' },
        }),
      }),
    } as unknown as ExecutionContext;
    await expect(guard.canActivate(context)).rejects.toThrow();
  });

  it('should throw if cvId does not match', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: (): { params: { cvId: string; id: string } } => ({
          params: { cvId: 'cv-2', id: createdWorkExperience.id },
        }),
      }),
    } as unknown as ExecutionContext;
    await expect(guard.canActivate(context)).rejects.toThrow();
  });

  it('should allow if cvId matches', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: (): { params: { cvId: string; id: string } } => ({
          params: { cvId: createdCV.id, id: createdWorkExperience.id },
        }),
      }),
    } as unknown as ExecutionContext;
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
