import { Query, Resolver } from '@nestjs/graphql';
import { Hospital } from './models/hospital.model';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver(Hospital)
export class HealthResolver {
    private readonly logger = new Logger(HealthResolver.name);
    constructor(
        @InjectRepository(Hospital)
        private readonly hospitalRepository: Repository<Hospital>,
    ) {}

    @Query(() => [Hospital])
    async allHospitals(): Promise<Hospital[]> {
        const hospitals = await this.hospitalRepository.find({
            order: {
                id: 'DESC',
            },
        });

        return hospitals;
    }
}
