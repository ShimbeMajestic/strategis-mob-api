import { Controller, Get, Param, Res, Query, UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common/services/logger.service';
import { UploadsService } from '../providers/uploads.service';
import { Response } from 'express';
import { SignedUrlGuard } from 'nestjs-url-generator';

@Controller('uploads')
export class UploadsController {
    protected readonly logger = new Logger(UploadsController.name);

    constructor(protected readonly service: UploadsService) {}

    @Get(':uploadId')
    @UseGuards(SignedUrlGuard)
    view(
        @Param('uploadId') uploadId,
        @Query('download') download,
        @Res() res: Response,
    ): Promise<void> {
        return this.service.download(uploadId, res, download);
    }
}
