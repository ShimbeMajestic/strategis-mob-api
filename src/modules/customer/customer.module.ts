import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { CustomerService } from './providers/customer.service';
import { CustomerResolver } from './resolvers/customer.resolver';
import { SortDirection } from '@ptc-org/nestjs-query-core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Customer]),
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([Customer])],
            dtos: [{ DTOClass: Customer }],
            resolvers: [
                {
                    DTOClass: Customer,
                    EntityClass: Customer,
                    read: {
                        disabled: false,
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    create: { disabled: true },
                    update: { disabled: true },
                    delete: { disabled: true },
                },
            ],
        }),
    ],
    providers: [CustomerService, CustomerResolver],
})
export class CustomerModule {}
