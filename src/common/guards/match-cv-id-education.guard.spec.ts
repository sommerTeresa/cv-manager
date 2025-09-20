import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CV } from '../../modules/cv/entities/cv.entity';
import { Education } from '../../modules/education/entities/education.entity';
import { WorkExperience } from '../../modules/work-experience/entities/work-experience.entity';
import { MatchCvIdEducationGuard } from './match-cv-id-education.guard';

describe('MatchCvIdEducationGuard', () => {
  let guard: MatchCvIdEducationGuard;
  let repo: Repository<Education>;
  let createdCV: CV;
  let createdEducation: Education;

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
        TypeOrmModule.forFeature([CV, Education]),
      ],
      providers: [MatchCvIdEducationGuard],
    }).compile();
    guard = module.get<MatchCvIdEducationGuard>(MatchCvIdEducationGuard);
    repo = module.get<Repository<Education>>(getRepositoryToken(Education));
    const cvRepo = module.get<Repository<CV>>(getRepositoryToken(CV));

    createdCV = await cvRepo.save({
      name: 'Teresa Sommer',
      email: 'teresa@example.com',
      skills: ['JavaScript', 'TypeScript'],
    });
    createdEducation = await repo.save({
      degree: 'BSc Computer Science',
      institution: 'Uni Example',
      startDate: '2015-10-01',
      endDate: '2018-09-30',
      cvId: createdCV.id,
    });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw if Education not found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: (): { params: { cvId: string; id: string } } => ({
          params: { cvId: createdCV.id, id: 'edu-404' },
        }),
      }),
    } as unknown as ExecutionContext;
    await expect(guard.canActivate(context)).rejects.toThrow();
  });

  it('should throw if cvId does not match', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: (): { params: { cvId: string; id: string } } => ({
          params: { cvId: 'cv-2', id: createdEducation.id },
        }),
      }),
    } as unknown as ExecutionContext;
    await expect(guard.canActivate(context)).rejects.toThrow();
  });

  it('should allow if cvId matches', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: (): { params: { cvId: string; id: string } } => ({
          params: { cvId: createdCV.id, id: createdEducation.id },
        }),
      }),
    } as unknown as ExecutionContext;
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
