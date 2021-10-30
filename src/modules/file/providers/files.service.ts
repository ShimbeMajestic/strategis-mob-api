import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { File } from '../models/file.model';
import * as sharp from 'sharp';
import { storageConfig } from 'src/config/storage.config';
import * as AWS from 'aws-sdk';

@Injectable()
export class FilesService {
  static s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: storageConfig.s3.region,
    accessKeyId: storageConfig.s3.accessKeyId,
    secretAccessKey: storageConfig.s3.secretAccessKey,
  });

  // async uploadFile(file: Express.Multer.File, isThumbnail?: boolean) {
  //     const key = isThumbnail
  //         ? `thumbnails/${uuid()}-${file.originalname.replace(/\s/g, '')}`
  //         : `${uuid()}-${file.originalname.replace(/\s/g, '')}`;
  //     const buffer = isThumbnail
  //         ? await this.compressImage(file.buffer)
  //         : file.buffer;
  //     const uploadResult = await FilesService.s3
  //         .upload({
  //             Bucket: storageConfig.s3.bucket,
  //             Body: buffer,
  //             Key: key,
  //         })
  //         .promise();

  //     const newFile = File.create({
  //         name: file.originalname,
  //         key: uploadResult.Key,
  //         userId: null,
  //         size: buffer.toString().length,
  //         mimeType: file.mimetype,
  //     });
  //     await newFile.save();

  //     const url = await this.getUrl(newFile.key);

  //     return { ...newFile, url };
  // }

  async getFile(fileId: number) {
    const file = await File.findOne({ id: fileId });
    if (file) {
      const url = await this.getUrl(file.key);
      return {
        ...file,
        url,
      };
    }
    throw new NotFoundException();
  }

  async getFileStream(fileId: number) {
    const fileInfo = await File.findOne({ id: fileId });
    if (fileInfo) {
      const stream = await FilesService.s3
        .getObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileInfo.key,
        })
        .createReadStream();

      return {
        stream,
        info: fileInfo,
      };
    }
    throw new NotFoundException();
  }

  async compressImage(buffer) {
    return sharp(buffer)
      .resize({ width: 300, height: 300 })
      .jpeg({ quality: 70, progressive: true })
      .toBuffer();
  }

  async downloadImage(key: string) {
    const result = await FilesService.s3
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      })
      .promise();

    return result.Body;
  }

  getUrl(key: string) {
    return new URL(key, storageConfig.mediaUrl).href;
  }

  async generatePresignedUrl(fileName: string) {
    const link = await FilesService.s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
    });

    return {
      success: true,
      message: 'Generated link',
      url: link,
    };
  }

  async generatePresignedPostUrl(fileName: string) {
    const key = `${uuid()}_${fileName}`;
    const params = {
      Bucket: storageConfig.s3.bucket,
      Expires: 1800,
      Fields: {
        key: key,
      },
      Conditions: [
        { acl: 'public-read' },
        ['content-length-range', 100, 10000000],
        // ['starts-with', '$key', 'uploads/'],
        ['starts-with', '$Content-Type', 'image/'],
      ],
    };

    return FilesService.s3.createPresignedPost(params);
  }
}
