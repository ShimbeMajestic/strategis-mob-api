import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { DEFAULT_CONNECTION } from './constants';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();

export const getDataSourceOptions = (): DataSourceOptions & SeederOptions => {
    return {
        name: DEFAULT_CONNECTION ?? 'default',

        type: process.env.DB_CONNECTION as 'postgres',
        host: process.env.DB_HOST as 'localhost',
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + '/../**/*.model.{js,ts}'],
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/**/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/**/factories/**/*{.ts,.js}'],

        logging: process.env.DB_LOGGING === 'true',
        extra: {
            migrationsDir: __dirname + '/migrations/',
        },
    };
};
