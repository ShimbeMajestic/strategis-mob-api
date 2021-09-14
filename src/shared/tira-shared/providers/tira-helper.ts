import { Injectable, Logger } from "@nestjs/common";
import * as xml2js from 'xml2js';
import { TiraCallback } from "../dtos/tira-callback.dto";
import { TiraSigner } from "./tira-signer";


@Injectable()
export class TiraHelper {

    private readonly logger = new Logger(TiraHelper.name);

    constructor(
        protected readonly tiraSigner: TiraSigner,
    ) { }

    jsonToXml(obj: any): string {
        const builder = new xml2js.Builder({
            headless: true,
            renderOpts: { pretty: false },
        });
        const xml = builder.buildObject(obj);

        return xml;
    }

    xmlToJson(xml: string): any {

        // const options = {
        //     explicitArray: false,
        //     normalize: false,
        //     normalizeTags: false,
        //     trim: true
        // };

        return new Promise((resolve, reject) => {

            xml2js.parseString(
                xml,
                // options,
                (err, result) => {
                    if (err) {
                        reject(err);
                    }

                    // `result` is a JavaScript object
                    // convert it to a JSON string
                    // const json = JSON.stringify(result, null, 4);

                    // // log JSON string
                    // this.logger.verbose(typeof json);

                    return resolve(result);
                });

        });

    }

    extractXml(xmlString: string, tagName: string, includeTags = true): string {

        const strartString = '<' + tagName + '>';
        const endString = '</' + tagName + '>';

        const startindex = xmlString.indexOf(strartString);
        const endindex = xmlString.indexOf(endString, startindex);

        if (startindex != -1
            && endindex != -1
            && endindex > startindex
        ) {
            if (includeTags) {
                return xmlString.substring(startindex, endindex + endString.length);
            }

            return xmlString.substring(startindex + strartString.length, endindex);
        }

    }

    async validateSignature(xmlString: string, messageTagName: string): Promise<boolean> {

        const message = this.extractXml(xmlString, messageTagName);

        const msgSignature = this.extractXml(xmlString, 'MsgSignature', false);

        const isValidSignature = await this.tiraSigner.verify(message, msgSignature)

        this.logger.debug(`Message: ${message}`);
        this.logger.debug(`Signature: ${msgSignature}`);
        this.logger.debug(`IsValid: ${isValidSignature}`);

        return isValidSignature;
    }

    async returnAcknowledgement(res: any, input: TiraCallback, ackTagName: string, statusCode = 'TIRA001', statusDesc = 'Successful') {

        const response = {
            [ackTagName]: {
                AcknowledgementId: input.RequestId,
                ResponseId: input.ResponseId,
                AcknowledgementStatusCode: statusCode,
                AcknowledgementStatusDesc: statusDesc,
            }
        };

        // Prepare signed response
        const xmlResponse = this.jsonToXml(response);
        const signature = await this.tiraSigner.sign(xmlResponse);

        const signedResponse = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            + `<TiraMsg>${xmlResponse}<MsgSignature>${signature}</MsgSignature></TiraMsg>`;

        this.logger.verbose(`CallbackResponse: ${signedResponse}`);

        // Return Final ACK Response
        res.set('Content-Type', 'application/xml');
        res.status(200);

        res.write(signedResponse);
        res.end();
    }

}
