import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { File } from '../models/file.model';
import { Any } from 'typeorm';

@Injectable()
export class FileLoader {
  public readonly findByIds = new DataLoader<File['id'], File>(
    async (fileIds) => {
      const files = await File.find({ id: Any(fileIds.concat()) });

      return fileIds.map((fileId) => files.find((file) => file.id === fileId));
    },
  );
}
