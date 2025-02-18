import { Controller, Get, Post, Param, Delete, UploadedFile, UseInterceptors, Body, Patch } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Folder to store uploaded files
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('title') title: string): Promise<import("/Users/pragadeesh/Documents/nodejs/workout/project1/src/document/document.entity").Document> {
    return this.documentService.uploadDocument(title, file.filename);
  }

  @Get()
  async getAllDocuments() {
    return this.documentService.getAllDocuments();
  }

  @Patch(':id')@UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Folder to store uploaded files
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async getUpdateDocumentById(@Param('id') id: number, @UploadedFile() file: Express.Multer.File, @Body('title') title: string) {
    return this.documentService.getUpdateDocumentById(id, title, file.filename);
  }

  @Get(':id')
  async getDocumentById(@Param('id') id: number) {
    return this.documentService.getDocumentById(id);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}
