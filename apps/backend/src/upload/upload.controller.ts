import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import {
  FileSizeValidationPipe,
  FileTypeValidationPipe,
} from './file-validation.pipe';

const buildStoredFilename = (originalName: string, prefix: string) => {
  const safeName = originalName.replace(/\s+/g, '-');
  const extension = extname(safeName);

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`.replace(
    /\\/g,
    '/',
  );
};

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (_, file, callback) => {
          callback(null, buildStoredFilename(file.originalname, 'image'));
        },
      }),
      fileFilter: (_, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return callback(
            new BadRequestException('Only image files are allowed.'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadFile(
    @UploadedFile(new FileSizeValidationPipe(), new FileTypeValidationPipe())
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }

    return this.uploadService.uploadImage(file);
  }

  @Post('document')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (_, file, callback) => {
          callback(null, buildStoredFilename(file.originalname, 'document'));
        },
      }),
      fileFilter: (_, file, callback) => {
        if (
          file.mimetype !== 'application/pdf' &&
          !file.originalname.toLowerCase().endsWith('.pdf')
        ) {
          return callback(
            new BadRequestException('Only PDF files are allowed.'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No document provided');
    }

    if (
      file.mimetype !== 'application/pdf' &&
      !file.originalname.toLowerCase().endsWith('.pdf')
    ) {
      throw new BadRequestException('Only PDF files are allowed.');
    }

    return this.uploadService.uploadDocument(file);
  }
}
