import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { CustomerService } from './providers/customer.service';
import { CustomerResolver } from './resolvers/customer.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Customer])],
      dtos: [{ DTOClass: Customer }],
    }),
  ],
  providers: [CustomerService, CustomerResolver],
})
export class CustomerModule {}
