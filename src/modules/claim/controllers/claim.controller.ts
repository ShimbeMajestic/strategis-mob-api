import {
    Controller,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ClaimService } from '../providers/claim.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/claim')
export class ClaimsController {
    constructor(private readonly service: ClaimService) {}

    @Post(':claimId/upload-photo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadClaimPhotos(
        @Param('claimId') claimId: number,
        @UploadedFile() uploadedFile: any,
    ) {
        return this.service.uploadClaimPhotos(claimId, uploadedFile);
    }
}
