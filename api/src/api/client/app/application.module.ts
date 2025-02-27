import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/services/database/database.module';
import { ClientAppController } from './app.controller';
import { ClientAppService } from './app.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ClientAppController],
    providers: [ClientAppService]
})
export class ClientAppModule {}