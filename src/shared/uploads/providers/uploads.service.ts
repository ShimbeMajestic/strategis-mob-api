import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Str } from 'src/shared/helpers';
import * as path from 'path';
import { promises as fs } from 'fs';
import { appConfig } from 'src/config/app.config';
import { Upload } from '../models/upload.model';
import { Response } from 'express';
import { DataSource } from 'typeorm';
import { FileHelper } from '../../helpers';
import { UrlGeneratorService } from 'nestjs-url-generator';
import * as moment from 'moment';
import { UploadsController } from '../controllers/uploads.controller';

@Injectable()
export class UploadsService implements OnModuleInit {
    private logger = new Logger(UploadsService.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly urlService: UrlGeneratorService,
    ) {}

    onModuleInit() {
        // Creates Upload Directory if does not exist
        this.createDirectory(appConfig.uploadsDir);
    }

    static getSignedUrl(upload: Upload, download = false) {
        return new URL(
            `uploads/${upload.id}/${upload.key}?download=${download}`,
            appConfig.baseUrl,
        ).href;
    }

    /**
     * Creates a directory path if not exists
     *
     * @param path Absolute path of directory
     */
    async createDirectory(path: string): Promise<string | undefined> {
        return fs.mkdir(path, { recursive: true });
    }

    /**
     * Deletes a directory path and its content
     *
     * @param path Absolute path of directory
     */
    async deleteDirectory(path: string): Promise<void> {
        return fs.rmdir(path, { recursive: true });
    }

    async uploadFileBase64(base64image: string): Promise<Upload> {
        // to convert base64 format into random filename
        const base64Data = base64image.replace(
            /^data:([A-Za-z-+/]+);base64,/,
            '',
        );

        const buffer = Buffer.from(base64Data, 'base64');

        return this.uploadFromBuffer(buffer);
    }

    async uploadFile(uploadedFile: any): Promise<Upload> {
        return this.uploadFromBuffer(uploadedFile.buffer, {
            fileName: uploadedFile.originalname,
        });
    }

    async uploadFromBuffer(
        fileBuffer: Buffer,
        options?: { fileName: string; extension?: string },
    ): Promise<Upload> {
        const type = await FileHelper.fileTypeFromBuffer(fileBuffer);
        const size = Buffer.byteLength(fileBuffer);

        // Get file extension
        let extension = '';
        let mimeType = '';
        if (type?.ext) {
            extension = type.ext;
            mimeType = type.mime;
        } else if (
            options?.fileName &&
            options?.fileName.split('.').length > 1
        ) {
            const fileNameParts = options.fileName?.split('.');
            extension = fileNameParts[fileNameParts.length - 1]; // get last part of fileName
            mimeType = extension;
        } else {
            extension = 'txt';
            mimeType = 'text/plain';
        }

        const fileNameOnDisk = Str.uuid() + '.' + extension;
        return await this.dataSource.manager.transaction(
            async (transactionalEntityManager) => {
                const fileModel = new Upload();
                fileModel.name = options?.fileName ?? fileNameOnDisk;
                fileModel.fileName = options?.fileName ?? fileNameOnDisk;
                fileModel.mimeType = mimeType;
                fileModel.size = size;
                fileModel.key = fileNameOnDisk;

                // Save file to database
                await transactionalEntityManager.save(fileModel);

                // Create Subdirectory for this media
                const thisMediaSubFolder = path.join(
                    appConfig.uploadsDir,
                    String(fileModel.id),
                );
                await this.createDirectory(thisMediaSubFolder);

                const location = path.join(thisMediaSubFolder, fileNameOnDisk);
                // Save file to disk
                await fs.writeFile(location, fileBuffer, { flag: 'wx' });

                return fileModel;
            },
        );
    }

    async download(uploadId: number, res: Response, download: boolean) {
        const fileInfo = await Upload.findOne({ where: { id: uploadId } });

        if (!fileInfo) {
            res.status(404).send('File not found');
            return;
        }

        const attachment = download ? 'attachment' : 'inline';
        const location = path.join(
            appConfig.uploadsDir,
            String(fileInfo.id),
            fileInfo.key,
        );

        const buffer = await fs.readFile(location);

        res.set('Content-Type', fileInfo.mimeType);
        res.set('Content-Length', String(fileInfo.size));
        res.set(
            'Content-Disposition',
            `${attachment}; filename="${appConfig.appName} ${fileInfo.key}"`,
        );
        res.set('Cache-Control', 'private, max-age=315360000');
        res.status(200);

        res.send(buffer);
    }

    async getSignedUrl(model: Upload, download = false) {
        const urlExpiresAt = moment().add(1, 'hour').toDate();

        return this.urlService.signControllerUrl({
            controller: UploadsController,
            controllerMethod: UploadsController.prototype.view,
            params: { uploadId: String(model.id) },
            query: { download: download },
            expirationDate: urlExpiresAt,
        });
    }
}
