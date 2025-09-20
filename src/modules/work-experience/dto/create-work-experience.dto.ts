import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWorkExperienceDto {
  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  cvId?: string;
}
