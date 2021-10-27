import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { File } from '../models/file.model';
import { FilesService } from '../providers/files.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => File)
export class FileResolver {
  constructor(protected readonly fileService: FilesService) {}

  @ResolveField(() => String)
  async url(@Parent() file: File): Promise<string> {
    return this.fileService.getUrl(file.key);
  }
}
