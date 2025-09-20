import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './modules/cv/cv.module';
import { CV } from './modules/cv/entities/cv.entity';
import { EducationModule } from './modules/education/education.module';
import { Education } from './modules/education/entities/education.entity';
import { WorkExperience } from './modules/work-experience/entities/work-experience.entity';
import { WorkExperienceModule } from './modules/work-experience/work-experience.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cv.sqlite',
      entities: [CV, Education, WorkExperience],
      synchronize: true,
    }),
    CvModule,
    EducationModule,
    WorkExperienceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
