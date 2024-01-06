import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Claim } from '../models/claim.model';
import { ClaimPhoto } from '../models/claim-photo.model';
import { UploadsService } from 'src/shared/uploads/providers/uploads.service';

@Injectable()
export class ClaimService {
    private readonly logger = new Logger(ClaimService.name);

    constructor(private readonly uploadService: UploadsService) {}

    async uploadClaimPhotos(claimId: number, uploadedFiles: any[]) {
        const claim = await Claim.findOne({
            where: {
                id: claimId,
            },
        });

        if (!claim) throw new NotFoundException('Claim not found');

        const uploadedArray = [];

        for (const uploadedFile of uploadedFiles) {
            const upload = await this.uploadService.uploadFile(uploadedFile);

            const claimPhoto = await ClaimPhoto.create({
                claimId,
                uploadId: upload.id,
            });

            await claimPhoto.save();

            uploadedArray.push(upload);
        }

        return uploadedArray;
    }
}
