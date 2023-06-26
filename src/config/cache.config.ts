import {
    CacheModuleOptions,
    CacheOptionsFactory,
    Injectable,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { redisConfig } from './redis.config';

export type CacheStore = 'memory' | 'redis';

/**
 * Cache config
 */
export const cacheConfig = {
    /**
     * The Cache store to be used.
     *
     * valid options:
     *  - 'memory'
     *          for local development, stores data in-memory array.
     *          Note: Cache is cleared on app restart.
     *  - 'redis' - for staging/production environments using redis store.
     *
     * default = 'redis'
     *
     */
    defaultStore: process.env.CACHE_STORE || ('redis' as CacheStore),

    stores: {
        memory: {
            ttl: null, // seconds;  null to use default
            max: null, // maximum number of items in cache; null to use default
        },

        redis: {
            store: redisStore,
            ...redisConfig.default,
        },
    } as { [key in CacheStore]: CacheModuleOptions },
};

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
    createCacheOptions(): CacheModuleOptions {
        switch (cacheConfig.defaultStore) {
            case 'memory':
                return cacheConfig.stores.memory;
            case 'redis':
                return cacheConfig.stores.redis;
            default:
                throw new Error(
                    `Invalid cache store ${cacheConfig.defaultStore}`,
                );
        }
    }
}
