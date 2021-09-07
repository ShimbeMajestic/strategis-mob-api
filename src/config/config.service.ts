require('dotenv').config();

class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) {}

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];

        if (!value && throwOnMissing) {
            // throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getAppUrl() {
        return this.getValue('APP_URL') ?? 'http://localhost:3000/';
    }

    public getPort() {
        return this.getValue('SERVER_PORT', true);
    }

    public isProduction() {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }

    public getTokenConfig(): any {
        return {
            secret: this.getValue('SECRET'),
            refreshTokenSecret: this.getValue('REFRESH_TOKEN_SECRET'),
            tokenLife: parseInt(this.getValue('TOKEN_LIFE')),
            refreshTokenLife: parseInt(this.getValue('REFRESH_TOKEN_LIFE')),
        };
    }
}

const configService = new ConfigService(process.env).ensureValues([
    'SECRET',
    'REFRESH_TOKEN_SECRET',
    'TOKEN_LIFE',
    'REFRESH_TOKEN_LIFE',
    'SERVER_PORT',
]);

export { configService };
