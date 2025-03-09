import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/services/database/database.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}