import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Form } from './form.entity';

export type QuestionType = 'text' | 'mcq';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Form, (f) => f.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'form_id' })
  form!: Form;

  @Column({ type: 'varchar', length: 255 })
  text!: string;

  @Column({ type: 'varchar', length: 16 })
  type!: QuestionType;

  @Column({ type: 'jsonb', nullable: true })
  options?: string[];
}

