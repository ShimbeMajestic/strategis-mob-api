import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { CustomerService } from './providers/customer.service';
import { CustomerResolver } from './resolvers/customer.resolver';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            // import the NestjsQueryTypeOrmModule to register the entity with typeorm
            // and provide a QueryService
            imports: [NestjsQueryTypeOrmModule.forFeature([Customer])],

            resolvers: [],
        }),
    ],
    providers: [CustomerService, CustomerResolver],
})
export class CustomerModule { }
