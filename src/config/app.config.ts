import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
    appName: process.env.APP_NAME || 'Strategis',

    baseUrl: process.env.APP_URL || 'http://localhost:3000',

    port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000,

    secret: process.env.SECRET,

    rootDir: path.join(__dirname, '../../'),

    appCallbackUrl: process.env.APP_CALLBACK_URL,

    tiraApiUrl: process.env.TIRA_BRIDGE_API_URL,

    environment: process.env.ENVIRONMENT || 'STAGING',

    uploadsDir:
        process.env.UPLOADS_PATH || path.join(__dirname, '../../../../uploads'),
};
