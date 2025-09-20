import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { MatchCvIdWorkExperienceGuard } from '../../common/guards/match-cv-id-work-experience.guard';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';
import { WorkExperience } from './entities/work-experience.entity';
import { WorkExperienceService } from './work-experience.service';

@Controller('cvs/:cvId/work-experiences')
export class WorkExperienceController {
  constructor(private readonly workExperienceService: WorkExperienceService) {}

  @Get()
  async findAll(@Param('cvId') cvId: string): Promise<WorkExperience[]> {
    return this.workExperienceService.findAll({ cvId });
  }

  @Get(':id')
  @UseGuards(MatchCvIdWorkExperienceGuard)
  async findOne(
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ): Promise<WorkExperience> {
    return this.workExperienceService.findOne(id);
  }

  @Post()
  async create(
    @Param('cvId') cvId: string,
    @Body() data: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    return this.workExperienceService.create({ ...data, cvId });
  }

  @Patch(':id')
  @UseGuards(MatchCvIdWorkExperienceGuard)
  async update(
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() data: UpdateWorkExperienceDto,
  ): Promise<WorkExperience> {
    return this.workExperienceService.update(id, { ...data, cvId });
  }

  @Delete(':id')
  @UseGuards(MatchCvIdWorkExperienceGuard)
  async remove(
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.workExperienceService.remove(id);
    return { message: 'WorkExperience deleted' };
  }
}
