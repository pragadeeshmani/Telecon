import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from './document/document.module';
import { IngestionModule } from './ingestion/ingestion.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',  // Change if using a remote database
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'Telecon',
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    DocumentModule,
    IngestionModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
