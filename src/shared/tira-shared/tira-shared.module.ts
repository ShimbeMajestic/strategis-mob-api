import { Module } from '@nestjs/common';
import { PKCS12 } from './providers/pkcs12';
import { TiraClient } from './providers/tira-client';
import { TiraHelper } from './providers/tira-helper';
import { TiraSigner } from './providers/tira-signer';

@Module({
    providers: [
        TiraSigner,
        TiraClient,
        TiraHelper,
        PKCS12,
    ],
    exports: [
        TiraSigner,
        TiraClient,
        TiraHelper,
    ],
})
export class TiraSharedModule { }
