import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CV } from '../../cv/entities/cv.entity';

@Entity()
export class WorkExperience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column()
  startDate: string;

  @Column({ nullable: true })
  endDate?: string;

  @Column()
  cvId: string;

  @ManyToOne(() => CV, (cv) => cv.workExperiences)
  cv: CV;
}
