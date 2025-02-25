import { registerEnumType } from '@nestjs/graphql';

export enum IdType {
    NIN = 'NIN',
    VOTERS_REG_NUM = 'VOTERS_REG_NUM',
    PASSPORT_NUM = 'PASSPORT_NUM',
    DRIVING_LICENSE = 'DRIVING_LICENSE',
    TIN_NUM = 'TIN',
    ZAN_ID = 'ZAN_ID',
    COMPANY_INC_CERT_NUMBER = 'COMPANY_INC_CERT_NUMBER',
}

registerEnumType(IdType, { name: 'IdType' });
