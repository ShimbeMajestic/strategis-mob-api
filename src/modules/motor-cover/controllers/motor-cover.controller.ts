import { Body, Controller, Logger, Post } from '@nestjs/common';

@Controller('motor-cover')
export class MotorCoverController {
  constructor() {}

  @Post('callback')
  callback(@Body() data: any) {
    console.log('CALLBACK');
    console.log(data);
  }
}
