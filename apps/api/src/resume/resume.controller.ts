import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeCv(@UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string }) {

    if (!file) {
      throw new BadRequestException('Vui lòng tải lên file PDF CV hợp lệ.');
    }

    if (file.mimetype !== 'application/pdf' && !file.originalname.endsWith('.pdf')) {
      throw new BadRequestException('Chỉ chấp nhận file định dạng PDF (.pdf).');
    }

    const result = await this.resumeService.analyzeCv(file.buffer);
    return {
      success: true,
      data: result,
    };
  }
}
