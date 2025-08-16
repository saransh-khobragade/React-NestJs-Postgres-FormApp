import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './form.entity';
import { Question } from './question.entity';
import { ResponseEntity } from './response.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { User } from '../users/user.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form) private readonly formRepo: Repository<Form>,
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    @InjectRepository(ResponseEntity) private readonly responseRepo: Repository<ResponseEntity>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createForm(ownerUserId: number, dto: CreateFormDto): Promise<Form> {
    const owner = await this.userRepo.findOne({ where: { id: ownerUserId } });
    if (!owner) throw new NotFoundException('Owner not found');

    const form = this.formRepo.create({ title: dto.title, user: owner });
    const savedForm = await this.formRepo.save(form);

    if (dto.questions?.length) {
      const questions = dto.questions.map((q) => this.questionRepo.create({
        form: savedForm,
        text: q.text,
        type: q.type,
        options: q.options,
      }));
      await this.questionRepo.save(questions);
      savedForm.questions = questions;
    } else {
      savedForm.questions = [];
    }
    return savedForm;
  }

  async getFormById(formId: number): Promise<Form> {
    const form = await this.formRepo.findOne({ where: { id: formId }, relations: ['questions', 'user'] });
    if (!form) throw new NotFoundException('Form not found');
    return form;
  }

  async getFormsByOwner(ownerUserId: number): Promise<Form[]> {
    return this.formRepo.find({ where: { user: { id: ownerUserId } }, relations: ['questions'] });
  }

  async submitResponse(formId: number, dto: SubmitResponseDto, respondingUserId?: number | null): Promise<ResponseEntity> {
    const form = await this.formRepo.findOne({ where: { id: formId } });
    if (!form) throw new NotFoundException('Form not found');

    const user = respondingUserId ? await this.userRepo.findOne({ where: { id: respondingUserId } }) : null;
    const response = this.responseRepo.create({ form, user: user ?? null, answers: dto.answers });
    return this.responseRepo.save(response);
  }

  async getResponses(formId: number, requesterUserId: number): Promise<ResponseEntity[]> {
    const form = await this.formRepo.findOne({ where: { id: formId }, relations: ['user'] });
    if (!form) throw new NotFoundException('Form not found');
    if (form.user.id !== requesterUserId) throw new ForbiddenException('Not authorized');
    return this.responseRepo.find({ where: { form: { id: formId } }, relations: ['user'] });
  }
}

