import { ConnectionOptions as BaseConnectionOptions } from 'typeorm';
import { DEFAULT_CONNECTION } from './constants';

type ConnectionOptions = BaseConnectionOptions & {
    seeds?: string[];
    factories?: string[];
};

export const getConnections = (): ConnectionOptions[] => [
    {
        name: DEFAULT_CONNECTION,
        type: process.env.DB_CONNECTION as 'postgres',  // i have changed 'mysql' to 'postgres'
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + '/../**/*.model.{js,ts}'],
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/factories/**/*{.ts,.js}'],
        cli: {
            migrationsDir: __dirname + '/migrations/',
        },
        logging: process.env.DB_LOGGING === 'true',
    },
];

export const getDefaultConnection = () =>
    getConnections().find(
        i => i.name === DEFAULT_CONNECTION,
    ) as ConnectionOptions;
