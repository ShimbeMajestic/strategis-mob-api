import * as crypto from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { PKCS12 } from './pkcs12';
import { tiraConfig } from 'src/config/tira.config';

const HASH_ALGO = 'sha1';

@Injectable()
export class TiraSigner {

    protected readonly logger = new Logger('TiraSigner');

    protected readonly publicKey = this.loadPublicKey();

    protected readonly privateKey = this.loadPrivateKey();

    constructor(
        protected readonly pkcs12: PKCS12,
    ) { }

    protected loadPrivateKey() {
        const certPath = tiraConfig.signer.tiraClientPrivateKey;
        const password = tiraConfig.signer.tiraClientPrivateKeyPassword;

        const pemKey = this.pkcs12.getKeyFromP12(certPath, password);

        const key = pemKey
            .replace('-----BEGIN RSA PRIVATE KEY-----', '-----BEGIN RSA PRIVATE KEY-----\n')
            .replace('-----END RSA PRIVATE KEY-----', '\n-----END RSA PRIVATE KEY-----');

        const keyObject = crypto.createPrivateKey(key);

        Logger.verbose('TIRA_CLIENT_PRIVATE_KEY loaded...', 'TIRA');

        return keyObject;
    }

    protected loadPublicKey() {
        const certPath = tiraConfig.signer.tiraPublicKey;
        const password = tiraConfig.signer.tiraPublicKeyPassword;

        const { pemCertificate, commonName } = this.pkcs12.getCertificateFromP12(certPath, password);

        const key = pemCertificate
            .replace('-----BEGIN CERTIFICATE-----', '-----BEGIN CERTIFICATE-----\n')
            .replace('-----END CERTIFICATE-----', '\n-----END CERTIFICATE-----');

        const keyObject = crypto.createPublicKey(key);

        Logger.verbose('TIRA_PUBLIC_KEY loaded...', 'TIRA');

        return keyObject;
    }

    async sign(payload: string): Promise<string> {

        // The signature method takes the data we want to sign, the
        // hashing algorithm, and the padding scheme, and generates
        // a signature in the form of bytes

        const options: crypto.VerifyKeyObjectInput = { key: this.privateKey };
        //options.padding = crypto.constants.RSA_PKCS1_PSS_PADDING;
        options.padding = crypto.constants.RSA_PKCS1_PADDING;

        const signature = crypto.sign(HASH_ALGO, Buffer.from(payload), options);

        const output = signature.toString("base64");
        this.logger.verbose(output);

        return output;
    }

    async verify(payload: string, signature: string): Promise<boolean> {

        const options: crypto.VerifyKeyObjectInput = { key: this.publicKey };
        options.padding = crypto.constants.RSA_PKCS1_PADDING;

        const isVerified = crypto.verify(
            HASH_ALGO,
            Buffer.from(payload),
            options,
            Buffer.from(signature, 'base64'),
        );

        // isVerified should be `true` if the signature is valid
        this.logger.verbose(`signature verified:  ${isVerified}`)

        return isVerified;

    }

}
