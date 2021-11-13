import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { getDefaultConnection } from './database/connections';
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

@Module({
  imports: [
    TypeOrmModule.forRoot(getDefaultConnection()),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
      context: ({ req }) => ({ req }),
      formatError: (error: GraphQLError) => {
        if (typeof error.message === 'string') {
          return new GraphQLError(error.message);
        }
        return new GraphQLError(error.message['message']);
      },
    }),
    FileModule,
    DatabaseModule,
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
  ],
})
export class AppModule {}
