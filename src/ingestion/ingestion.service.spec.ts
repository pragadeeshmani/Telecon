import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingestion } from './ingestion.entity';

const mockIngestionRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((ingestion) => Promise.resolve({ id: 1, ...ingestion })),
  find: jest.fn().mockResolvedValue([{ id: 1, status: 'in_progress' }]),
  findOne: jest.fn().mockImplementation(({ where: { id } }) => 
    Promise.resolve(id === 1 ? { id, status: 'in_progress' } : null)
  ),
};

describe('IngestionService', () => {
  let ingestionService: IngestionService;
  let ingestionRepository: Repository<Ingestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockIngestionRepository,
        },
      ],
    }).compile();

    ingestionService = module.get<IngestionService>(IngestionService);
    ingestionRepository = module.get<Repository<Ingestion>>(getRepositoryToken(Ingestion));
  });

  it('should create and start an ingestion process', async () => {
    const result = await ingestionService.startIngestion();
    expect(result).toEqual({ id: 1, status: 'in_progress' });
    expect(ingestionRepository.create).toHaveBeenCalled();
    expect(ingestionRepository.save).toHaveBeenCalled();
  });

  it('should update ingestion status', async () => {
    const result = await ingestionService.updateIngestionStatus(1, 'completed', 'Ingestion successful');
    expect(result).toEqual({ id: 1, status: 'completed', message: 'Ingestion successful' });
    expect(ingestionRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(ingestionRepository.save).toHaveBeenCalled();
  });

  it('should get all ingestion processes', async () => {
    const result = await ingestionService.getAllIngestions();
    expect(result).toEqual([{ id: 1, status: 'in_progress' }]);
    expect(ingestionRepository.find).toHaveBeenCalled();
  });

  it('should get an ingestion by ID', async () => {
    const result = await ingestionService.getIngestionById(1);
    expect(result).toEqual({ id: 1, status: 'in_progress' });
    expect(ingestionRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw an error when updating non-existing ingestion', async () => {
    await expect(ingestionService.updateIngestionStatus(999, 'completed', 'Ingestion failed')).rejects.toThrow('Ingestion not found');
  });
});
