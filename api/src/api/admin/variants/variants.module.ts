import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/services/database/database.module';
import { VariantsController } from './variants.controller';
import { VariantsService } from './variants.service';
import { FileService } from 'src/services/files/file.services';
import { CloudService } from 'src/services/cloud/cloud.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VariantsController],
  providers: [VariantsService, FileService, CloudService]
})
export class VariantsModule {}
