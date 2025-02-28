import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/services/database/database.module';
import { ClientAppController } from './app.controller';
import { ClientAppService } from './app.service';
import { CloudService } from 'src/services/cloud/cloud.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ClientAppController],
    providers: [ClientAppService, CloudService]
})
export class ClientAppModule {}