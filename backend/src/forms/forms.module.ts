import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './form.entity';
import { Question } from './question.entity';
import { ResponseEntity } from './response.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { User } from '../users/user.entity';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Question, ResponseEntity, User])],
  providers: [FormsService, JwtStrategy],
  controllers: [FormsController],
})
export class FormsModule {}

