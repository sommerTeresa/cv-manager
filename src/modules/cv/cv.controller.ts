import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { CV } from './entities/cv.entity';

@Controller('cvs')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get()
  async findAll(): Promise<CV[]> {
    return this.cvService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CV> {
    return this.cvService.findOne(id);
  }

  @Post()
  async create(@Body() createCvDto: CreateCvDto): Promise<CV> {
    return this.cvService.create(createCvDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
  ): Promise<CV> {
    return this.cvService.update(id, updateCvDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.cvService.remove(id);
    return { message: 'CV deleted' };
  }
}
