import { Controller, Get, Post, Param, Patch, Body } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) { }

    @Post('trigger')
    async triggerIngestion() {
        return this.ingestionService.triggerIngestion();
    }

    @Post()
    create(@Body('source') source: string) {
        return this.ingestionService.create(source);
    }

    @Get()
    findAll() {
        return this.ingestionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ingestionService.findOne(+id);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @Body('errorMessage') errorMessage?: string,
    ) {
        return this.ingestionService.updateStatus(+id, status, errorMessage);
    }
}
