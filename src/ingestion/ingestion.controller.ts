import { Controller, Get, Post, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('ingestion')
export class IngestionController {
    startIngestion() {
      throw new Error('Method not implemented.');
    }
    updateIngestion(arg0: number, arg1: string, arg2: string) {
      throw new Error('Method not implemented.');
    }
    getAllIngestions() {
      throw new Error('Method not implemented.');
    }
    getIngestionById(arg0: number) {
      throw new Error('Method not implemented.');
    }
    constructor(private readonly ingestionService: IngestionService) { }

    @Post('trigger')
    @UseGuards(JwtAuthGuard)
    async triggerIngestion() {
        return this.ingestionService.triggerIngestion();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body('source') source: string) {
        return this.ingestionService.create(source);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.ingestionService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.ingestionService.findOne(+id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @Body('errorMessage') errorMessage?: string,
    ) {
        return this.ingestionService.updateStatus(+id, status, errorMessage);
    }
}
