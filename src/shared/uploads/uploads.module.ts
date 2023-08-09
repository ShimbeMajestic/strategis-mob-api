import { Module } from '@nestjs/common';
import { UploadsController } from './controllers/uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadsResolver } from './resolvers/uploads.resolver';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Upload } from './models/upload.model';

@Module({
    imports: [
        NestjsQueryGraphQLModule.forFeature({
            imports: [NestjsQueryTypeOrmModule.forFeature([Upload])],
            dtos: [{ DTOClass: Upload }],
            resolvers: [
                {
                    DTOClass: Upload,
                    EntityClass: Upload,
                    read: { disabled: true },
                    create: { disabled: true },
                    update: { disabled: true },
                    delete: { disabled: true },
                },
            ],
        }),
    ],
    providers: [UploadsService, UploadsResolver],
    exports: [UploadsService],
    controllers: [UploadsController],
})
export class UploadsModule {}
