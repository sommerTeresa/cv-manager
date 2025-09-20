import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCvDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];
}
