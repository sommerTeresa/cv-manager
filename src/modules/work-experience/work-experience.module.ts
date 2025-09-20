import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValidateCvExistsMiddleware } from '../../common/middleware/validate-cv-exists.middleware';
import { CV } from '../cv/entities/cv.entity';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperience } from './entities/work-experience.entity';
import { WorkExperienceService } from './work-experience.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperience, CV])],
  providers: [WorkExperienceService],
  controllers: [WorkExperienceController],
  exports: [TypeOrmModule],
})
export class WorkExperienceModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(ValidateCvExistsMiddleware)
      .forRoutes(WorkExperienceController);
  }
}
