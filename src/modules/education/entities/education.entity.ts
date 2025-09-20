import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CV } from '../../cv/entities/cv.entity';

@Entity()
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  institution: string;

  @Column()
  degree: string;

  @Column()
  startDate: string;

  @Column({ nullable: true })
  endDate?: string;

  @Column()
  cvId: string;

  @ManyToOne(() => CV, (cv) => cv.educations)
  cv: CV;
}
