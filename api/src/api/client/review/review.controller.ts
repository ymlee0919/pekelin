import { Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import { ClientReviewService } from './review.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ReviewLink } from "./review.types";
import { ReviewDTO } from './review.dto';
import { ReviewLinkPipe } from 'src/services/pipes/reviewLink.pipe';

@Controller('client/review')
export class ClientReviewController {

    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(
        private readonly manager: ClientReviewService
    ){}

    @Public()
    @Get('/:url')
    async getLink( @Param('url', ReviewLinkPipe) url: string): Promise<ReviewLink> {
        let result = await this.manager.getReview(url)
        return result;
    }

    @Public()
    @Post('/:url')
    async makeReview(
        @Param('url', ReviewLinkPipe) url: string,
        @Body() review: ReviewDTO
    ): Promise<boolean> {
        let result = await this.manager.makeReview(url, review.rate, review.comment);
        return result;
    }
}