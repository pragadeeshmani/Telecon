import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingestion } from './ingestion.entity';

@Injectable()
export class IngestionService {
    startIngestion() {
      throw new Error('Method not implemented.');
    }
    updateIngestionStatus(arg0: number, arg1: string, arg2: string) {
      throw new Error('Method not implemented.');
    }
    getAllIngestions() {
      throw new Error('Method not implemented.');
    }
    getIngestionById(arg0: number) {
      throw new Error('Method not implemented.');
    }
    private readonly pythonApiUrl = 'https://dummy-json.mock.beeceptor.com/posts'; // Change to your Python API endpoint

    async triggerIngestion(): Promise<any> {
        try {
            const response = await axios.get(this.pythonApiUrl);
            return response.data;
        } catch (error) {
            throw new HttpException(
                'Failed to trigger ingestion: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    constructor(
        @InjectRepository(Ingestion)
        private readonly ingestionRepository: Repository<Ingestion>,
    ) { }

    async create(source: string): Promise<Ingestion> {
        const ingestion = this.ingestionRepository.create({ source, status: 'pending' });
        return this.ingestionRepository.save(ingestion);
    }

    async findAll(): Promise<Ingestion[]> {
        return this.ingestionRepository.find();
    }

    async findOne(id: number): Promise<Ingestion> {
        const ingestion = await this.ingestionRepository.findOne({ where: { id } });
        if (!ingestion) {
            throw new NotFoundException(`Ingestion process #${id} not found`);
        }
        return ingestion;
    }

    async updateStatus(id: number, status: string, errorMessage?: string): Promise<Ingestion> {
        const ingestion = await this.findOne(id);
        ingestion.status = status;
        if (status === 'in_progress') ingestion.startedAt = new Date();
        if (status === 'completed' || status === 'failed') ingestion.completedAt = new Date();
        if (errorMessage) ingestion.errorMessage = errorMessage;

        return this.ingestionRepository.save(ingestion);
    }
}
