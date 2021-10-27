import {
  Controller,
  Post,
  // Get,
  // Param,
  UploadedFile,
  UseInterceptors,
  Query,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './providers/files.service';
// import { FindOneParams } from './dtos/find-one.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Post('upload')
  // // @UseGuards(GqlAuthGuard)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //     @UploadedFile() file: Express.Multer.File,
  //     @Query() options,
  // ) {
  //     return this.filesService.uploadFile(file, options.isThumbnail);
  // }

  @Get('get-signed-url/:key')
  async getSignedUrl(@Param('key') key: string) {
    return this.filesService.generatePresignedPostUrl(key);
  }

  // @Get('/:id')
  // // @UseGuards(GqlAuthGuard)
  // async getPrivateFile(@Param() { id }: FindOneParams) {
  //     return await this.filesService.getFile(Number(id));
  // }
}
