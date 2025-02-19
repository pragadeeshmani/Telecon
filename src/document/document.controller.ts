import { Controller, Get, Post, Param, Delete, UploadedFile, UseInterceptors, Body, Patch, UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('documents')
export class DocumentController {
  uploadDocument(arg0: { name: string; path: string; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
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
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('title') title: string): Promise<import("C:/Users/priya/Documents/nodejs/Telecon/src/document/document.entity").Document> {
    return this.documentService.uploadDocument(title, file.filename);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDocuments() {
    return this.documentService.getAllDocuments();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  async getUpdateDocumentById(@Param('id') id: number, @UploadedFile() file: Express.Multer.File, @Body('title') title: string) {
    return this.documentService.getUpdateDocumentById(id, title, file.filename);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getDocumentById(@Param('id') id: number) {
    return this.documentService.getDocumentById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}
