import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CreateClaimDto } from './dtos/create-claim.dto';
import { Claim } from './models/claim.model';
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
          //   create: {},
          update: { disabled: true },/* disables claims updates because claims should not be edited after creation*/
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
