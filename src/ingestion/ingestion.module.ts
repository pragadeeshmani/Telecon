import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { Ingestion } from './ingestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingestion])],
  providers: [IngestionService],
  controllers: [IngestionController]
})
export class IngestionModule { }
