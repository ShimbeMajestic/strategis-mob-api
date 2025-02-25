import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../models/claim.model';
import { ClaimPhoto } from '../models/claim-photo.model';
import { UploadsService } from 'src/shared/uploads/providers/uploads.service';

@Injectable()
export class ClaimService {
    private readonly logger = new Logger(ClaimService.name);

    constructor(
        @InjectRepository(Claim)
        private readonly claimRepository: Repository<Claim>,
        private readonly uploadService: UploadsService,
    ) {}

    async uploadClaimPhotos(claimId: number, uploadedFile: any, attachmentType: string) {
        const claim = await this.claimRepository.findOne({
            where: {
                id: claimId,
            },
        });

        if (!claim) throw new NotFoundException('Claim not found');

        const upload = await this.uploadService.uploadFile(uploadedFile);

        const claimPhoto = ClaimPhoto.create({
            claimId,
            uploadId: upload.id,
            attachmentType, // Store the attachment type
        });

        await claimPhoto.save();

        return upload;
    }
}
