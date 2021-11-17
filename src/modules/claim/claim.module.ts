import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { Claim } from './models/claim.model';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Claim])],
      resolvers: [
        {
          DTOClass: Claim,
          EntityClass: Claim,
          create: { disabled: true },
          update: { disabled: true },
        },
      ],
    }),
  ],
})
export class ClaimModule {}
