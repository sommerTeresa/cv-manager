import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ValidateCvExistsMiddleware } from '../../common/middleware/validate-cv-exists.middleware';
import { CV } from '../cv/entities/cv.entity';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { Education } from './entities/education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education, CV])],
  providers: [EducationService],
  controllers: [EducationController],
  exports: [TypeOrmModule],
})
export class EducationModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ValidateCvExistsMiddleware).forRoutes(EducationController);
  }
}
