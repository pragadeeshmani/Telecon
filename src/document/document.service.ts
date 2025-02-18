import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async uploadDocument(title: string, filename: string) {
    const document = this.documentRepository.create({ title, filename });
    return await this.documentRepository.save(document);
  }

  async getAllDocuments() {
    return await this.documentRepository.find();
  }

  async getDocumentById(id: number) {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) throw new NotFoundException('Document not found');
    return document;
  }

  async getUpdateDocumentById(id: number, title: string, filename: string) {
    const updatedDocument = this.documentRepository.create({ title, filename });
    const documentUpdate = await this.documentRepository.update(id, updatedDocument);
    if (!documentUpdate) throw new NotFoundException('Document not found');
    const document = await this.documentRepository.findOne({ where: { id } });
    return document;
  }

  async deleteDocument(id: number) {
    const result = await this.documentRepository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException('Document not found');
    return { message: 'Document deleted successfully' };
  }
}
