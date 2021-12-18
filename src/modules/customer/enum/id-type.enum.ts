import { registerEnumType } from '@nestjs/graphql';

export enum IdType {
  NIN = 1,
  VOTERS_REG_NUM = 2,
  PASSPORT_NUM = 3,
}

registerEnumType(IdType, { name: 'IdType' });
