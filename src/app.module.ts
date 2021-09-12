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
import { MotorCovernoteModule } from './modules/motor-covernote/motor-covernote.module';

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
  ],
})
export class AppModule { }
