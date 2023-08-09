import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { Queue } from 'bull';
import { BullExpressAdapter } from './bull-express.adapter';

@Injectable()
export class BullUiProvider implements OnModuleInit {
    public queues: Queue[] = [];

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly modulesContainer: ModulesContainer,
        private readonly bullServerAdapter: BullExpressAdapter,
    ) {}

    protected exporeQueueNames(): string[] {
        // find all the controllers
        const modules = [...this.modulesContainer.values()];

        const queueNames = [];
        modules
            .filter(({ providers }) => providers.size > 0)
            .map(({ providers }) => providers)
            .forEach((map) => {
                const names = Array.from(map.values())
                    .filter((item) => item.name.startsWith('BullQueue_'))
                    .map((item) => item.name);

                queueNames.push(...names);
            });

        return [...new Set(queueNames)]; // Set removes duplicates
    }

    onModuleInit() {
        // Explore Bull Queues from Nestjs Context
        const QUEUE_NAMES = this.exporeQueueNames();

        // Get the queues from context
        this.queues = QUEUE_NAMES.map((name) => {
            return this.moduleRef.get(name, { strict: false });
        });

        // Create Bull UI
        createBullBoard({
            queues: this.queues.map((queue) => new BullAdapter(queue)),
            serverAdapter: this.bullServerAdapter,
        });
    }
}
