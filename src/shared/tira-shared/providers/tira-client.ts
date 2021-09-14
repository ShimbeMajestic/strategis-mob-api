import { Injectable, Logger } from "@nestjs/common";
import * as Axios from 'axios';
import * as http from 'http';
import * as https from 'https';
import { tiraConfig } from "src/config/tira.config";
import { TiraSigner } from "./tira-signer";

@Injectable()
export class TiraClient {

    protected httpClient: Axios.AxiosInstance;

    protected readonly logger = new Logger('TiraClient');

    constructor(
        protected readonly tiraSigner: TiraSigner,
    ) { }

    async call(url: string, xmlMessage: string) {

        // Prepare signed request
        const signature = await this.tiraSigner.sign(xmlMessage);
        const signedRequest = `<TiraMsg>${xmlMessage}<MsgSignature>${signature}</MsgSignature></TiraMsg>`;

        const headers = this.headers();

        this.logger.debug(`URL: ${url}, Request: ${signedRequest}`);

        const tiraResponse = await this.post(url, signedRequest, { headers });

        // @TODO Validate response signature

        this.logger.debug(`Response: ${tiraResponse.data}`);

        return tiraResponse.data;
    }


    protected async post(url: string, data?: string, config?: Axios.AxiosRequestConfig): Promise<Axios.AxiosResponse<any>> {

        // Prepare auth headers
        return await this.http().post(url, data, config);
    }

    protected headers() {
        return {
            "Content-Type": 'application/xml',
            "ClientCode": tiraConfig.clientCode,
            "ClientKey": tiraConfig.clientKey,
        }
    }

    protected http(): Axios.AxiosInstance {

        if (!this.httpClient) {
            this.httpClient = Axios.default.create({
                //60 sec timeout
                timeout: 60000,

                //keepAlive pools and reuses TCP connections, so it's faster
                httpAgent: new http.Agent({ keepAlive: true }),
                httpsAgent: new https.Agent({ keepAlive: true }),

                //follow up to 10 HTTP 3xx redirects
                maxRedirects: 10,

                //cap the maximum content length we'll accept to 120MBs, just in case
                maxContentLength: 120 * 1000 * 1000
            });
        }

        return this.httpClient;
    }
}
