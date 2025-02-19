import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

const mockIngestionService = {
  startIngestion: jest.fn().mockResolvedValue({ id: 1, status: 'in_progress' }),
  updateIngestionStatus: jest.fn().mockImplementation((id, status, message) =>
    Promise.resolve({ id, status, message })
  ),
  getAllIngestions: jest.fn().mockResolvedValue([{ id: 1, status: 'in_progress' }]),
  getIngestionById: jest.fn().mockImplementation((id) =>
    Promise.resolve(id === 1 ? { id, status: 'in_progress' } : null)
  ),
};

describe('IngestionController', () => {
  let ingestionController: IngestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{ provide: IngestionService, useValue: mockIngestionService }],
    }).compile();

    ingestionController = module.get<IngestionController>(IngestionController);
  });

  it('should trigger a new ingestion process', async () => {
    const result = await ingestionController.startIngestion();
    expect(result).toEqual({ id: 1, status: 'in_progress' });
    expect(mockIngestionService.startIngestion).toHaveBeenCalled();
  });

  it('should update an ingestion process', async () => {
    const result = await ingestionController.updateIngestion(1, 'completed', 'Success');
    expect(result).toEqual({ id: 1, status: 'completed', message: 'Success' });
    expect(mockIngestionService.updateIngestionStatus).toHaveBeenCalledWith(1, 'completed', 'Success');
  });

  it('should fetch all ingestion processes', async () => {
    const result = await ingestionController.getAllIngestions();
    expect(result).toEqual([{ id: 1, status: 'in_progress' }]);
    expect(mockIngestionService.getAllIngestions).toHaveBeenCalled();
  });

  it('should fetch an ingestion by ID', async () => {
    const result = await ingestionController.getIngestionById(1);
    expect(result).toEqual({ id: 1, status: 'in_progress' });
    expect(mockIngestionService.getIngestionById).toHaveBeenCalledWith(1);
  });

  it('should return null for non-existing ingestion', async () => {
    const result = await ingestionController.getIngestionById(999);
    expect(result).toBeNull();
  });
});
