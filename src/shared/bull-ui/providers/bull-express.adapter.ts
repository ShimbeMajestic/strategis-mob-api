import { ExpressAdapter } from '@bull-board/express';
import { Injectable } from '@nestjs/common';
import { bullUiConfig } from '../config/bull-ui.config';

@Injectable()
export class BullExpressAdapter extends ExpressAdapter {

    constructor() {
        super();
        // Set UI URL path
        this.setBasePath(bullUiConfig.basePath);
    }

}
