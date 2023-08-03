import { registerEnumType } from '@nestjs/graphql';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

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

@ValidatorConstraint({ name: 'identityNumber', async: false })
export class IdNumberLengthValidator implements ValidatorConstraintInterface {
    private idLengthMap = {
        [IdType.NIN]: 20,
        [IdType.VOTERS_REG_NUM]: 13,
        [IdType.PASSPORT_NUM]: undefined,
        [IdType.DRIVING_LICENSE]: 10,
        [IdType.TIN_NUM]: 9,
        [IdType.ZAN_ID]: 10,
        [IdType.COMPANY_INC_CERT_NUMBER]: 30,
    };

    validate(
        value: any,
        args?: ValidationArguments,
    ): boolean | Promise<boolean> {
        const enumValue = args.object['identityType'] as IdType;
        const requiredLength = this.idLengthMap[enumValue];

        if (requiredLength === undefined) {
            return true;
        }

        return value.length === requiredLength;
    }

    defaultMessage(args?: ValidationArguments): string {
        const enumValue = args.object['identityType'] as IdType;
        const enumDisplayValueMap = {
            NIN: 'National Identification Number(NIN)',
            VOTERS_REG_NUM: 'Voters Registration Number',
            PASSPORT_NUM: 'Passport Number',
            DRIVING_LICENSE: 'Driving License',
            TIN_NUM: 'Tax Identification Number(TIN)',
            ZAN_ID: 'Zanzibar Identification Number',
            COMPANY_INC_CERT_NUMBER: 'Company Incorporation Certificate Number',
        };
        return `${enumDisplayValueMap[enumValue]} must have ${this.idLengthMap[enumValue]} characters`;
    }
}
