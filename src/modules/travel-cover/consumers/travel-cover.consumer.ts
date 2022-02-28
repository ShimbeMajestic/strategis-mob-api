import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TRAVEL_COVER_QUEUE } from 'src/shared/sms/constants';
import { TravelCoverRequest } from '../models/travel-cover-request.model';
import { MapfreService } from '../providers/mapfre.service';

@Processor(TRAVEL_COVER_QUEUE)
export class TravelConsumer {
  protected readonly logger = new Logger(TravelConsumer.name);

  constructor(private mapfreService: MapfreService) {}

  @Process('TRAVEL_COVER_REQUEST_JOB')
  async processMapfreCoverRequest(job: Job<TravelCoverRequest>) {
    this.logger.log(
      `Processing travel cover request job for mapfre: ${job.id}`,
    );

    const order = job.data;

    const result = await this.mapfreService.issuePolicy(order);

    this.logger.log(
      `Response from Mapfre for order: ${JSON.stringify(result)}`,
    );
  }
}
