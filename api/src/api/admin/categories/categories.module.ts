import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/services/database/database.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { FileService } from 'src/services/files/file.services';
import { CloudService } from 'src/services/cloud/cloud.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, FileService, CloudService],
})
export class CategoriesModule {}