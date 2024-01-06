import {
    Controller,
    Param,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ClaimService } from '../providers/claim.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/claim')
export class ClaimsController {
    constructor(private readonly service: ClaimService) {}

    @Post(':claimId/upload-photo')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadClaimPhotos(
        @Param('claimId') claimId: number,
        @UploadedFiles() uploadedFiles,
    ) {
        return this.service.uploadClaimPhotos(claimId, uploadedFiles);
    }
}
