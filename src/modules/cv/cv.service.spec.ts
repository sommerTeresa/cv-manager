import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Education } from '../education/entities/education.entity';
import { WorkExperience } from '../work-experience/entities/work-experience.entity';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { CV } from './entities/cv.entity';

const createData: CreateCvDto = {
  name: 'Teresa Sommer',
  email: 'teresa@example.com',
  skills: ['JavaScript', 'TypeScript'],
};

describe('CvService', () => {
  let cvService: CvService;
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
      providers: [CvService],
    }).compile();
    cvService = module.get<CvService>(CvService);
    repo = module.get<Repository<CV>>(getRepositoryToken(CV));
  });

  it('should be defined', () => {
    expect(cvService).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all CVs', async () => {
      await repo.clear();

      await cvService.create(createData);
      await cvService.create({ ...createData, name: 'Another Teresa' });
      const all = await cvService.findAll();
      expect(all.length).toBe(2);
      expect(all.map((c) => c.name)).toEqual(
        expect.arrayContaining(['Teresa Sommer', 'Another Teresa']),
      );
    });

    it('should return empty array if no CVs', async () => {
      await repo.clear();
      const all = await cvService.findAll();
      expect(all).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find a CV by id', async () => {
      const created = await cvService.create(createData);
      const found = await cvService.findOne(created.id);
      expect(found).toMatchObject(createData);
    });

    it('should throw if CV not found', async () => {
      await expect(cvService.findOne('999')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a CV', async () => {
      const result = await cvService.create(createData);
      expect(result).toMatchObject(createData);
      expect(result.id).toBeDefined();

      const found = await repo.findOneBy({ id: result.id });
      expect(found).toMatchObject(createData);
    });
  });

  describe('update', () => {
    it('should update name', async () => {
      const created = await cvService.create(createData);
      const updateData = { name: 'Teresa Som' };
      const updated = await cvService.update(created.id, updateData);
      expect(updated.name).toBe(updateData.name);
      expect(updated.email).toBe(createData.email);

      const found = await repo.findOneBy({ id: created.id });
      expect(found?.name).toBe(updateData.name);
    });

    it('should update skills', async () => {
      const created = await cvService.create(createData);
      const updateData = { skills: ['NestJS', 'Node.js'] };
      const updated = await cvService.update(created.id, updateData);
      expect(updated.skills).toEqual(updateData.skills);

      const found = await repo.findOneBy({ id: created.id });
      expect(found?.skills).toEqual(updateData.skills);
    });

    it('should update email', async () => {
      const created = await cvService.create(createData);
      const updateData = { email: 'new@example.com' };
      const updated = await cvService.update(created.id, updateData);
      expect(updated.email).toBe(updateData.email);

      const found = await repo.findOneBy({ id: created.id });
      expect(found?.email).toBe(updateData.email);
    });

    it('should throw if updating non-existent CV', async () => {
      await expect(cvService.update('999', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a CV', async () => {
      const created = await cvService.create(createData);
      await cvService.remove(created.id);

      const found = await repo.findOneBy({ id: created.id });
      expect(found).toBeNull();
    });

    it('should throw if removing non-existent CV (integration)', async () => {
      await expect(cvService.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
