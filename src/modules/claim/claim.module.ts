import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CreateClaimDto } from './dtos/create-claim.dto';
import { Claim } from './models/claim.model';
import { SortDirection } from '@ptc-org/nestjs-query-core';
import { ClaimResolver } from './resolvers/claim.resolver';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([Claim])],
            resolvers: [
                {
                    guards: [GqlAuthGuard],
                    DTOClass: Claim,
                    EntityClass: Claim,
                    CreateDTOClass: CreateClaimDto,
                    read: {
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                    },
                    update: { disabled: true },
                    enableAggregate: true,
                    enableTotalCount: true,
                    enableSubscriptions: true,
                },
            ],
        }),
    ],
    providers: [ClaimResolver],
})
export class ClaimModule {}
