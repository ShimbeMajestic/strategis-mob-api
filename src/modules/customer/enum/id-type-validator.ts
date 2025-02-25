import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { IdType } from './id-type.enum';

@ValidatorConstraint({ name: 'isValidEnumValue', async: false })
export class IsValidEnumValue implements ValidatorConstraintInterface {
    validate(value: any) {
        // Allow null values
        if (value === null || value === undefined) {
            return true;
        }

        // Check if the value is a valid enum value
        return Object.values(IdType).includes(value as IdType);
    }

    defaultMessage(): string {
        return 'Invalid enum value';
    }
}

@ValidatorConstraint({ name: 'IdNumberLengthValidator', async: false })
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

    private NumericIdTypes = new Set([IdType.TIN_NUM, IdType.NIN]);

    validate(
        value: any,
        args?: ValidationArguments,
    ): boolean | Promise<boolean> {
        const enumValue = args.object['identityType'] as IdType;
        const requiredLength = this.idLengthMap[enumValue];

        if (requiredLength === undefined) {
            return true;
        }

        if (this.NumericIdTypes.has(enumValue)) {
            // Check if the value is a string containing only numeric characters
            return /^\d+$/.test(value) && value.length === requiredLength;
        } else {
            return value.length === requiredLength;
        }
    }

    defaultMessage(args?: ValidationArguments): string {
        const enumValue = args.object['identityType'] as IdType;
        const enumDisplayValueMap = {
            NIN: 'National Identification Number(NIN)',
            VOTERS_REG_NUM: 'Voters Registration Number',
            PASSPORT_NUM: 'Passport Number',
            DRIVING_LICENSE: 'Driving License',
            TIN: 'Tax Identification Number(TIN)',
            ZAN_ID: 'Zanzibar Identification Number',
            COMPANY_INC_CERT_NUMBER: 'Company Incorporation Certificate Number',
        };

        if (this.NumericIdTypes.has(enumValue)) {
            return `${enumDisplayValueMap[enumValue]} must be a number of ${this.idLengthMap[enumValue]} characters`;
        }
        return `${enumDisplayValueMap[enumValue]} must have ${this.idLengthMap[enumValue]} characters`;
    }
}
