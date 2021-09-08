import { registerEnumType } from "@nestjs/graphql";

export enum IdType {
    NIN = "National Identification Number (NIN)",
    VOTERS_REG_NUM = "Voters registration number",
    PASSPORT_NUM = "Passport number",
    DRIVING_LICENSE = "Driving License",
    ZAN_ID = "Zanzibar Resident Id(ZANID)",
    TIN = "Tax Identification Number (TIN)",
    COMPANY_INC_CERT_NUMBER = "Company Incorporation Certificate Number"
}

registerEnumType(IdType, { name: 'IdType' });

