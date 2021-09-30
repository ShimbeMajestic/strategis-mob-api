/**
 * Sms config
 */
export const smsConfig = {
    /**
     * The SMS forwarding service to be used.
     *
     * valid options:
     *  - 'log' - for local development, will only log output to console
     *  - 'infobip' - for infobip sms gateway
     *  - 'fasthub' - for fasthub sms gateway
     */
    driver: process.env.SMS_DRIVER || 'log',

    infobip: {
        username: process.env.INFOBIP_USERNAME,
        password: process.env.INFOBIP_PASSWORD,
        defaultSender: process.env.INFOBIP_DEFAULT_SENDER,
        baseUrl: process.env.INFOBIP_BASE_URL,
        apiKey: process.env.INFOBIP_API_KEY
    },

    fastHub: {
        channelID: process.env.FASTHUB_SMS_CHANNEL_ID || '',
        channelPassword: process.env.FASTHUB_SMS_PASSWORD || '',
        defaultSenderID: process.env.FASTHUB_SMS_SENDER_ID || 'CHAPCHAP',
        endpoint:
            process.env.FASTHUB_SMS_ENDPOINT ||
            'https://secure-gw.fasthub.co.tz/fasthub/messaging/json/api',
    },
};
