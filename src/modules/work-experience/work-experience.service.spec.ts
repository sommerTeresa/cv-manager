import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CV } from '../cv/entities/cv.entity';
import { Education } from '../education/entities/education.entity';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';
import { WorkExperience } from './entities/work-experience.entity';
import { WorkExperienceService } from './work-experience.service';

const createData: CreateWorkExperienceDto = {
  position: 'Software Engineer',
  company: 'Acme Corp',
  startDate: '2020-01-01',
  endDate: '2021-01-01',
};

describe('WorkExperienceService', () => {
  let service: WorkExperienceService;
  let repo: Repository<WorkExperience>;
  let createdCV: CV;
  let createdCV2: CV;

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
        TypeOrmModule.forFeature([CV, WorkExperience]),
      ],
      providers: [WorkExperienceService],
    }).compile();
    service = module.get<WorkExperienceService>(WorkExperienceService);
    repo = module.get<Repository<WorkExperience>>(
      getRepositoryToken(WorkExperience),
    );

    const cvRepo = module.get<Repository<CV>>(getRepositoryToken(CV));

    createdCV = await cvRepo.save({
      name: 'Teresa Sommer',
      email: 'teresa@example.com',
      skills: ['JavaScript', 'TypeScript'],
    });
    createData.cvId = createdCV.id;

    createdCV2 = await cvRepo.save({
      name: 'Another Teresa Sommer',
      email: 'teresa@example.com',
      skills: ['JavaScript', 'TypeScript'],
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all WorkExperiences', async () => {
      await repo.clear();
      await service.create(createData);
      await service.create({
        ...createData,
        position: 'Another Job',
      });
      await service.create({
        ...createData,
        cvId: createdCV2.id,
      });
      const all = await service.findAll();
      expect(all.length).toBe(3);
    });

    it('should find all WorkExperiences for a cvId', async () => {
      await repo.clear();
      await service.create(createData);
      await service.create({
        ...createData,
        position: 'Another Job',
      });
      const all = await service.findAll({ cvId: createData.cvId });
      expect(all.length).toBe(2);
      expect(all.map((w) => w.position)).toEqual(
        expect.arrayContaining(['Software Engineer', 'Another Job']),
      );
    });

    it('should return empty array if none for cvId', async () => {
      await repo.clear();
      const all = await service.findAll({ cvId: 'nonexistent-cv' });
      expect(all).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find a WorkExperience by id', async () => {
      const created = await service.create(createData);
      const found = await service.findOne(created.id);
      expect(found).toMatchObject(createData);
    });

    it('should throw if WorkExperience not found', async () => {
      await expect(service.findOne('123')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a WorkExperience', async () => {
      const result = await service.create(createData);
      expect(result).toMatchObject(createData);
      expect(result.id).toBeDefined();

      const found = await repo.findOneBy({ id: result.id });
      expect(found).toMatchObject(createData);
    });
  });

  describe('update', () => {
    it('should update a WorkExperience', async () => {
      const created = await service.create(createData);
      const updateData: UpdateWorkExperienceDto = {
        position: 'Senior Engineer',
      };
      const updated = await service.update(created.id, updateData);
      expect(updated.position).toBe(updateData.position);
      expect(updated.company).toBe(createData.company);

      const found = await repo.findOneBy({ id: created.id });
      expect(found?.position).toBe(updateData.position);
    });

    it('should throw if updating non-existent WorkExperience', async () => {
      await expect(service.update('999', { position: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a WorkExperience', async () => {
      const created = await service.create(createData);
      await service.remove(created.id);
      const found = await repo.findOneBy({ id: created.id });
      expect(found).toBeNull();
    });

    it('should throw if removing non-existent WorkExperience', async () => {
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
