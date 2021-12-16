import { Body, Controller, Logger, Post } from '@nestjs/common';
import { TiraCallbackDto } from '../dtos/tira-callback.dto';
import { MotorCovernoteService } from '../providers/motor-covernote.service';

@Controller('motor-cover')
export class MotorCoverController {
  constructor(private service: MotorCovernoteService) {}

  @Post('callback')
  callback(@Body() input: TiraCallbackDto) {
    return this.service.handleCallbackFromTira(input);
  }
}
