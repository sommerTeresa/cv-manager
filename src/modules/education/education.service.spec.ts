import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CV } from '../cv/entities/cv.entity';
import { WorkExperience } from '../work-experience/entities/work-experience.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationService } from './education.service';
import { Education } from './entities/education.entity';

const createData: CreateEducationDto = {
  degree: 'BSc Computer Science',
  institution: 'Uni Example',
  startDate: '2015-10-01',
  endDate: '2018-09-30',
};

describe('EducationService', () => {
  let educationService: EducationService;
  let repo: Repository<Education>;
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
        TypeOrmModule.forFeature([CV, Education]),
      ],
      providers: [EducationService],
    }).compile();
    educationService = module.get<EducationService>(EducationService);
    repo = module.get<Repository<Education>>(getRepositoryToken(Education));

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
    expect(educationService).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all Educations', async () => {
      await repo.clear();
      await educationService.create(createData);
      await educationService.create({ ...createData, degree: 'PhD' });
      await educationService.create({ ...createData, cvId: createdCV2.id });

      const all = await educationService.findAll();
      expect(all.length).toBe(3);
    });

    it('should find all Educations for a cvId', async () => {
      await repo.clear();
      await educationService.create(createData);
      await educationService.create({
        ...createData,
        degree: 'PhD',
      });
      const all = await educationService.findAll({ cvId: createData.cvId });

      expect(all.length).toBe(2);
      expect(all.map((e) => e.degree)).toEqual(
        expect.arrayContaining(['BSc Computer Science', 'PhD']),
      );
    });

    it('should return empty array if none for cvId', async () => {
      await repo.clear();
      const all = await educationService.findAll({ cvId: 'nonexistent-cv' });
      expect(all).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find an Education by id', async () => {
      const created = await educationService.create(createData);
      const found = await educationService.findOne(created.id);
      expect(found).toMatchObject(createData);
    });

    it('should throw if Education not found', async () => {
      await expect(educationService.findOne('123')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create an Education', async () => {
      const result = await educationService.create(createData);
      expect(result).toMatchObject(createData);
      expect(result.id).toBeDefined();

      const found = await repo.findOneBy({ id: result.id });
      expect(found).toMatchObject(createData);
    });
  });

  describe('update', () => {
    it('should update an Education', async () => {
      const created = await educationService.create(createData);
      const updateData: UpdateEducationDto = { degree: 'MSc Computer Science' };
      const updated = await educationService.update(created.id, updateData);
      expect(updated.degree).toBe(updateData.degree);
      expect(updated.institution).toBe(createData.institution);

      const found = await repo.findOneBy({ id: created.id });
      expect(found?.degree).toBe(updateData.degree);
    });

    it('should throw if updating non-existent Education', async () => {
      await expect(
        educationService.update('999', { degree: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an Education', async () => {
      const created = await educationService.create(createData);
      await educationService.remove(created.id);

      const found = await repo.findOneBy({ id: created.id });
      expect(found).toBeNull();
    });

    it('should throw if removing non-existent Education', async () => {
      await expect(educationService.remove('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
