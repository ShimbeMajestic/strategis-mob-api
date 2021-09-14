import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as forge from 'node-forge';

/**
 * This class is based on p12-pem npm package
 */
@Injectable()
export class PKCS12 {

    getKeyFromP12(certPath: string, password: string): string {

        const p12base64 = fs.readFileSync(certPath, { encoding: 'binary' });

        const p12Asn1 = forge.asn1.fromDer(p12base64);
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

        const keyData = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag }, password);
        let pkcs8Key = keyData[forge.pki.oids.pkcs8ShroudedKeyBag][0];
        if (typeof pkcs8Key === 'undefined') {
            pkcs8Key = keyData[forge.pki.oids.keyBag][0];
        }
        if (typeof pkcs8Key === 'undefined') {
            throw new Error('Unable to get private key.');
        }
        let pemKey = forge.pki.privateKeyToPem(pkcs8Key.key);
        pemKey = pemKey.replace(/\r\n/g, '');
        return pemKey;
    }

    getCertificateFromP12(certPath: string, password: string) {

        const p12base64 = fs.readFileSync(certPath, { encoding: 'binary' });

        const p12Asn1 = forge.asn1.fromDer(p12base64);
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

        const certData = p12.getBags({ bagType: forge.pki.oids.certBag });
        const certificate = certData[forge.pki.oids.certBag][0];
        let pemCertificate = forge.pki.certificateToPem(certificate.cert);
        pemCertificate = pemCertificate.replace(/\r\n/g, '');
        const commonName = certificate.cert.subject.attributes[0].value;
        return { pemCertificate: pemCertificate, commonName: commonName };
    }
}
