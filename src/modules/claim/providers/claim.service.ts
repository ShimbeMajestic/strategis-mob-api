import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../models/claim.model';
import { ClaimPhoto } from '../models/claim-photo.model';
import { UploadsService } from 'src/shared/uploads/providers/uploads.service';

@Injectable()
export class ClaimService {
    private readonly logger = new Logger(ClaimService.name);

    constructor(
        @InjectRepository(Claim) // Injecting the Claim repository for database operations
        private readonly claimRepository: Repository<Claim>,
        private readonly uploadService: UploadsService, // Injecting the Uploads service for file handling
    ) {}

    // Method to upload photos related to a claim
    async uploadClaimPhotos(claimId: number, uploadedFile: any, attachmentType: string) {
        const claim = await this.claimRepository.findOne({ where: { id: claimId } });

        // Throw an error if the claim is not found
        if (!claim) {
            throw new NotFoundException('Claim not found');
        }

        // Upload the file and get the upload details
        const upload = await this.uploadService.uploadFile(uploadedFile);

        // Create a new ClaimPhoto instance
        const claimPhoto = this.claimRepository.create({
            claimId,
            uploadId: upload.id,
            attachmentType, // Store the attachment type
        });

        // Save the claim photo to the database
        await this.claimRepository.save(claimPhoto);
        return upload; // Return the upload details
    }

    // Method to create a new claim
    async createClaim(claimData: Partial<Claim>) {
        // Validate required fields
        if (!claimData.title || !claimData.description) {
            throw new BadRequestException('Title and description are required');
        }

        // Create a new Claim instance
        const claim = this.claimRepository.create(claimData);
        return await this.claimRepository.save(claim); // Save and return the new claim
    }

    // Method to update an existing claim
    async updateClaim(claimId: number, updateData: Partial<Claim>) {
        const claim = await this.claimRepository.findOne(claimId);
        
        // Throw an error if the claim is not found
        if (!claim) {
            throw new NotFoundException('Claim not found');
        }

        // Update the claim with new data
        await this.claimRepository.update(claimId, updateData);
        return await this.claimRepository.findOne(claimId); // Return the updated claim
    }

    // Method to delete a claim
    async deleteClaim(claimId: number) {
        const claim = await this.claimRepository.findOne(claimId);
        
        // Throw an error if the claim is not found
        if (!claim) {
            throw new NotFoundException('Claim not found');
        }

        // Remove the claim from the database
        await this.claimRepository.remove(claim);
        return { message: 'Claim deleted successfully' }; // Return a success message
    }

    // Method to retrieve all claims
    async allClaims(): Promise<Claim[]> {
        return await this.claimRepository.find({ order: { id: 'DESC' } }); // Return all claims ordered by ID in descending order
    }
}
