import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { FileHelper } from '../../helpers';
import { Upload } from '../models/upload.model';
import { UploadsService } from '../providers/uploads.service';

@Resolver(Upload)
export class UploadsResolver {
    constructor(private readonly fileService: UploadsService) {}

    @ResolveField(() => String)
    async humanReadableSize(@Parent() model: Upload): Promise<string> {
        return FileHelper.humanRedableSize(model.size);
    }

    @ResolveField(() => String)
    async signedUrl(@Parent() model: Upload): Promise<string> {
        return this.fileService.getSignedUrl(model);
    }

    @ResolveField(() => String)
    async signedDownloadUrl(@Parent() model: Upload): Promise<string> {
        return this.fileService.getSignedUrl(model, true);
    }
}
