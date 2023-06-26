import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { getDataSourceOptions } from './dataSourceOptions';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [],
        useFactory: () => getDataSourceOptions(),
        inject: [],
    } as TypeOrmModuleAsyncOptions),
];
