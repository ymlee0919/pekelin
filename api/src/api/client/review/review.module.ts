import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/services/database/database.module';
import { ClientReviewController } from './review.controller';
import { ClientReviewService } from './review.service';
import { CloudService } from 'src/services/cloud/cloud.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ClientReviewController],
    providers: [ClientReviewService, CloudService]
})
export class ClientReviewModule {}