import {
    Body,
    Controller,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { TiraCallbackDto } from '../dtos/tira-callback.dto';
import { MotorCovernoteService } from '../providers/motor-covernote.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/motor-cover')
export class MotorCoverController {
    constructor(private service: MotorCovernoteService) {}

    @Post('callback')
    callback(@Body() input: TiraCallbackDto) {
        return this.service.handleCallbackFromTira(input);
    }

    @Post(':motorCoverRequestId/upload-photo/:view')
    @UseInterceptors(FileInterceptor('file'))
    async uploadVehiclePhoto(
        @Param('motorCoverRequestId') motorCoverRequestId: number,
        @Param('view') view: string,
        @UploadedFile() uploadedFile: any,
    ) {
        return this.service.uploadVehiclePhoto(
            motorCoverRequestId,
            view,
            uploadedFile,
        );
    }
}
