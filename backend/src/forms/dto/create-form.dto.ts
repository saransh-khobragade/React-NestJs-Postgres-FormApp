import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsString()
  @IsIn(['text', 'mcq'])
  type!: 'text' | 'mcq';

  @IsOptional()
  @IsArray()
  @Type(() => String)
  options?: string[];
}

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions!: CreateQuestionDto[];
}

