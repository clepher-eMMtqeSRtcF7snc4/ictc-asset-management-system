import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  private buildRelativePath(folder: 'images' | 'documents', file: Express.Multer.File) {
    const fileName = file.filename || file.originalname;
    return `${folder}/${fileName}`.replace(/\\/g, '/');
  }

  async uploadImage(file: Express.Multer.File) {
    const relativePath = this.buildRelativePath('images', file);
    return {
      filename: relativePath,
      path: relativePath,
      url: `/uploads/${relativePath}`,
    };
  }

  async uploadDocument(file: Express.Multer.File) {
    const relativePath = this.buildRelativePath('documents', file);
    return {
      filename: relativePath,
      path: relativePath,
      url: `/uploads/${relativePath}`,
    };
  }
}
