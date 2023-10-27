import { Injectable, Logger } from '@nestjs/common';
import { MotorCoverRequest } from '../models/motor-cover-request.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { In, IsNull } from 'typeorm';

@Injectable()
export class MotorCoverNoteScheduler {
    private readonly logger = new Logger(MotorCoverNoteScheduler.name);

    @Cron(CronExpression.EVERY_30_SECONDS)
    async removeIncompleteRequests() {
        this.logger.log(
            'Executing job for removal of incomplete cover requests',
        );

        const requests = await MotorCoverRequest.find({
            where: {
                minimumAmount: IsNull(),
            },
            take: 100,
        });

        const requestsId = requests.map((request) => request.id);

        await MotorCoverRequest.delete({ id: In(requestsId) });
    }
}
