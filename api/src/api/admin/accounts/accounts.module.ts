import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { DatabaseModule } from 'src/services/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule {}