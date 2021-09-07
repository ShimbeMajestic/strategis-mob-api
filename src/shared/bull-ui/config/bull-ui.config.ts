require('dotenv').config();

const parseBoolean = (value: string, defaultValue = true): boolean => {
    // Set default to `true` enabled
    if (!value) return defaultValue;

    // Otherwise set to boolean value as string config
    return Boolean(JSON.parse(process.env.BULL_UI_AUTH_ENABLED))
}

export const bullUiConfig = {

    enable: parseBoolean(process.env.BULL_UI_ENABLED, true),

    basePath: process.env.BULL_UI_BASE_PATH || '/admin/queues',

    authEnabled: parseBoolean(process.env.BULL_UI_AUTH_ENABLED, true),

    basicAuth: {
        username: process.env.BULL_UI_USERNAME || 'admin',
        password: process.env.BULL_UI_PASSWORD || 'C0d3bl0ck@!2021',
    },

}
