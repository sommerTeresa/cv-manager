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

import { MatchCvIdEducationGuard } from '../../common/guards/match-cv-id-education.guard';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationService } from './education.service';
import { Education } from './entities/education.entity';

@Controller('cvs/:cvId/educations')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAll(@Param('cvId') cvId: string): Promise<Education[]> {
    return this.educationService.findAll({ cvId });
  }

  @Get(':id')
  @UseGuards(MatchCvIdEducationGuard)
  async findOne(
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ): Promise<Education> {
    return await this.educationService.findOne(id);
  }

  @Post()
  async create(
    @Param('cvId') cvId: string,
    @Body() data: CreateEducationDto,
  ): Promise<Education> {
    return this.educationService.create({ ...data, cvId });
  }

  @Patch(':id')
  @UseGuards(MatchCvIdEducationGuard)
  async update(
    @Param('cvId') cvId: string,
    @Param('id') id: string,
    @Body() data: UpdateEducationDto,
  ): Promise<Education> {
    return this.educationService.update(id, { ...data, cvId });
  }

  @Delete(':id')
  @UseGuards(MatchCvIdEducationGuard)
  async remove(
    @Param('cvId') cvId: string,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.educationService.remove(id);
    return { message: 'Education deleted' };
  }
}
