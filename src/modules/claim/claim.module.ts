import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { CreateClaimDto } from './dtos/create-claim.dto';
import { Claim } from './models/claim.model';
import { ClaimResolver } from './resolvers/claim.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Claim])],
      resolvers: [
        {
          DTOClass: Claim,
          EntityClass: Claim,
          CreateDTOClass: CreateClaimDto,
          //   create: {},
          update: { disabled: true },
        },
      ],
    }),
  ],
  providers: [ClaimResolver],
})
export class ClaimModule {}
