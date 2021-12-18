import { registerEnumType } from '@nestjs/graphql';

export enum IdType {
  NIN = 'NIN',
  VOTERS_REG_NUM = 'VOTERS_REG_NUM',
  PASSPORT_NUM = 'PASSPORT_NUM',
}

registerEnumType(IdType, { name: 'IdType' });
