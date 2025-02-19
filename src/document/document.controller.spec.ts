import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

const mockDocumentService = {
  uploadDocument: jest.fn().mockResolvedValue({ id: 1, name: 'Test Document', path: '/uploads/test.pdf' }),
  getAllDocuments: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Document', path: '/uploads/test.pdf' }]),
  getDocumentById: jest.fn().mockImplementation((id) =>
    Promise.resolve(id === 1 ? { id, name: 'Test Document', path: '/uploads/test.pdf' } : null)
  ),
  deleteDocument: jest.fn().mockResolvedValue({}),
};

describe('DocumentController', () => {
  let documentController: DocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [{ provide: DocumentService, useValue: mockDocumentService }],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
  });

  it('should upload a document', async () => {
    const result = await documentController.uploadDocument({ name: 'Test Document', path: '/uploads/test.pdf' });
    expect(result).toEqual({ id: 1, name: 'Test Document', path: '/uploads/test.pdf' });
    expect(mockDocumentService.uploadDocument).toHaveBeenCalledWith({ name: 'Test Document', path: '/uploads/test.pdf' });
  });

  it('should fetch all documents', async () => {
    const result = await documentController.getAllDocuments();
    expect(result).toEqual([{ id: 1, name: 'Test Document', path: '/uploads/test.pdf' }]);
    expect(mockDocumentService.getAllDocuments).toHaveBeenCalled();
  });

  it('should fetch a document by ID', async () => {
    const result = await documentController.getDocumentById(1);
    expect(result).toEqual({ id: 1, name: 'Test Document', path: '/uploads/test.pdf' });
    expect(mockDocumentService.getDocumentById).toHaveBeenCalledWith(1);
  });

  it('should delete a document', async () => {
    const result = await documentController.deleteDocument(1);
    expect(result).toEqual({});
    expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith(1);
  });

  it('should return null for non-existing document', async () => {
    const result = await documentController.getDocumentById(999);
    expect(result).toBeNull();
  });
});
