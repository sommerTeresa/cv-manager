import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Education } from '../../education/entities/education.entity';
import { WorkExperience } from '../../work-experience/entities/work-experience.entity';

@Entity()
export class CV {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column('simple-json')
  skills: string[];

  @OneToMany(() => Education, (education) => education.cv, { cascade: true })
  educations: Education[];

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.cv, {
    cascade: true,
  })
  workExperiences: WorkExperience[];
}
