import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerAuthModule } from './modules/customer-auth/customer-auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ListsModule } from './modules/lists/lists.module';
import { PermissionModule } from './modules/permission/permission.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared/shared.module';
import { MotorCovernoteModule } from './modules/motor-cover/motor-covernote.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { FileModule } from './modules/file/file.module';
import { TravelCoverModule } from './modules/travel-cover/travel-cover.module';
import { HealthCoverModule } from './modules/health-cover/health-cover.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ClaimModule } from './modules/claim/claim.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from './config/cache.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        CacheModule.registerAsync({
            isGlobal: true,
            useClass: CacheConfigService,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            includeStacktraceInErrorResponses: false,
            context: ({ req, res, payload, connection }: any) => ({
                req,
                res,
                payload,
                connection,
            }),
            subscriptions: {
                'graphql-ws': true,
                'subscriptions-transport-ws': {
                    onConnect: (connectionParams) => {
                        return {
                            req: {
                                headers: {
                                    authorization: `${connectionParams.headers['Authorization']}`,
                                },
                            },
                        };
                    },
                },
            },
        }),
        FileModule,
        UserModule,
        AuthModule,
        SharedModule,
        PermissionModule,
        ListsModule,
        CustomerModule,
        CustomerAuthModule,
        ScheduleModule.forRoot(),
        MotorCovernoteModule,
        TransactionsModule,
        TravelCoverModule,
        HealthCoverModule,
        NotificationModule,
        ClaimModule,
    ],
})
export class AppModule {}
