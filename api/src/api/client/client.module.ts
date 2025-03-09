import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/services/database/database.module';
import { ClientAppModule } from './app/application.module';
import { ClientReviewModule } from './review/review.module';

@Module({
    imports: [
        DatabaseModule,
        ClientAppModule,
        ClientReviewModule
    ],

})
export class ClientModule {}