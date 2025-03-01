import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/services/database/database.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { FileService } from 'src/services/files/file.services';
import { CloudService } from 'src/services/cloud/cloud.service';
import { SetsController } from './sets.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController, SetsController],
  providers: [ProductsService, FileService, CloudService]
})
export class ProductsModule {}
