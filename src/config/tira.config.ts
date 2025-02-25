import * as dotenv from 'dotenv';

dotenv.config();

export const tiraConfig = {
    clientCode: process.env.TIRA_CLIENT_CODE,

    clientKey: process.env.TIRA_CLIENT_KEY,

    companyCode: process.env.TIRA_COMPANY_CODE,

    systemCode: process.env.TIRA_SYSTEM_CODE,

    salesPointCode: process.env.TIRA_SALES_POINT_CODE,

    endpoints: {
        baseUrl: process.env.TIRA_ENDPOINT || 'http://41.59.86.178:8091',

        motorCoverNoteUrl:
            '/ecovernote/api/covernote/non-life/motor/v1/request',

        nonMotorCoverNoteUrl:
            '/ecovernote/api/covernote/non-life/other/v1/request',

        reinsuranceUrl: '/ecovernote/api/reinsurance/v1/request',

        policySubmissionUrl: '/ecovernote/api/policy/v1/request',

        claimNotificationUrl: '/eclaim/api/claim/claim-notification/v1/request',

        claimIntimationUrl: '/eclaim/api/claim/claim-intimation/v1/request',

        claimAssessmentUrl: '/eclaim/api/claim/claim-assessment/v1/request',

        claimDischargeUrl:
            '/eclaim/api/claim/claim-dischargevoucher/v1/request',

        claimPaymentUrl: '/eclaim/api/claim/claim-payment/v1/request',

        claimRejectionUrl: '/eclaim/api/claim/claim-rejection/v1/request',

        vehicleDetailsUrl: '/dispatch/api/motor/verification/v1/request',
    },

    signer: {
        hashAlgorithm: 'sha1',

        /**
         * Used to verify incoming messages from TIRAMIS
         *
         * pkcs12 (.pfx, .p12) format.
         */
        tiraPublicKey: process.env.TIRA_PUBLIC_KEY,

        tiraPublicKeyPassword: process.env.TIRA_PUBLIC_KEY_PASSWORD,

        /**
         * Used to sign outgoing messages to TIRAMIS
         *
         * pkcs12 (.pfx, .p12) format.
         */
        tiraClientPrivateKey: process.env.TIRA_CLIENT_PRIVATE_KEY,

        tiraClientPrivateKeyPassword:
            process.env.TIRA_CLIENT_PRIVATE_KEY_PASSWORD,
    },
};
