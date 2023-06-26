/**
 * Contains default CORS configurations
 *
 * Refer to https://github.com/expressjs/cors#configuration-options
 * for documentation on each option.
 */

export const corsConfig = {
    credentials: true,

    origin: [
        // staging
        'https://codeblock.co.tz',
        /.codeblock.co.tz$/,

        // local development
        'http://localhost',
        /^(http:\/\/localhost:)/,

        // strategis local
        'https://192.168.1.10:4545',
    ],

    methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],

    allowedHeaders: [
        'Content-Type',
        'Origin',
        'Authorization',
        'X-Requested-With,',
    ],

    exposedHeaders: [
        'Cache-Control',
        'Content-Language',
        'Content-Type',
        'Expires',
        'Last-Modified',
        'Pragma',
        'Access-Control-Allow-Headers',
    ],

    preflightContinue: false,

    optionsSuccessStatus: 204,

    maxAge: 60 * 60 * 24,
};
