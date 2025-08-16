import { IsObject } from 'class-validator';

export class SubmitResponseDto {
  @IsObject()
  answers!: Record<string, unknown>;
}

