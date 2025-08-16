import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('forms')
@Controller('api/forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async listMine(@Request() req: any) {
    const forms = await this.formsService.getFormsByOwner(req.user.userId);
    return { success: true, data: forms };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createForm(@Request() req: any, @Body() dto: CreateFormDto) {
    const form = await this.formsService.createForm(req.user.userId, dto);
    return { success: true, data: form };
  }

  @Get(':id')
  async getForm(@Param('id') id: string) {
    const form = await this.formsService.getFormById(Number(id));
    return { success: true, data: form };
  }

  @Post(':id/responses')
  async submit(@Param('id') id: string, @Body() dto: SubmitResponseDto, @Request() req: any) {
    const userId: number | null = req.user?.userId ?? null;
    const res = await this.formsService.submitResponse(Number(id), dto, userId);
    return { success: true, data: res };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/responses')
  async getResponses(@Param('id') id: string, @Request() req: any) {
    const list = await this.formsService.getResponses(Number(id), req.user.userId);
    return { success: true, data: list };
  }
}

