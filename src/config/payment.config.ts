/**
 * Payment config
 */
export const paymentConfig = {
    /**
     * The SMS forwarding service to be used.
     *
     * valid options:
     *  - 'log' - for local development, will only log output to console
     *  - 'infobip' - for infobip sms gateway
     *  - 'fasthub' - for fasthub sms gateway
     */
    driver: process.env.PAYMENT_DRIVER || 'log',

    fastHub: {
        channelID: process.env.FASTHUB_GATEWAY_CHANNEL_ID || '',
        altChannelID: process.env.FASTHUB_ALT_GATEWAY_CHANNEL_ID || '',
        username: process.env.FASTHUB_GATEWAY_USERNAME || '',
        password: process.env.FASTHUB_GATEWAY_PASSWORD || '',
        key: process.env.FASTHUB_HASH_KEY || '',
        endpoint:
            process.env.FASTHUB_GATEWAY_URL ||
            'https://secure-gw-test.fasthub.co.tz/fasthub/mobile/money/debitdeposit/api/json',
        altEndpoint:
            process.env.FASTHUB_ALT_GATEWAY_URL ||
            'https://gcs-api.fasthub.co.tz/fasthub/mobile/money/debitdeposit/api/json',
    },
    callback:
        process.env.PAYMENT_GATEWAY_CALLBACK_URL ||
        'https://chapchap-api.codeblock.co.tz/payment/callback',
};
