import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullExpressAdapter } from './providers/bull-express.adapter';
import { BullUiProvider } from './providers/bull-ui.provider';
import * as basicAuth from 'express-basic-auth';
import { bullUiConfig } from './config/bull-ui.config';

@Module({
    providers: [BullUiProvider, BullExpressAdapter],
})
export class BullUiModule implements NestModule {
    constructor(private bullServerAdapter: BullExpressAdapter) {}

    configure(consumer: MiddlewareConsumer): void {
        if (bullUiConfig.authEnabled) {
            consumer
                .apply(
                    basicAuth({
                        challenge: true,
                        users: {
                            [bullUiConfig.basicAuth.username]:
                                bullUiConfig.basicAuth.password,
                        },
                    }),
                )
                .forRoutes(bullUiConfig.basePath);
        }

        consumer
            .apply(this.bullServerAdapter.getRouter())
            .forRoutes(bullUiConfig.basePath);
    }
}
