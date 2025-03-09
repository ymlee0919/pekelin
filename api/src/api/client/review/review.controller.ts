import { Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import { ClientReviewService } from './review.service';
import { Public } from 'src/api/admin/auth/guard/public.guard';
import { ReviewLink } from "./review.types";
import { ReviewDTO } from './review.dto';

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
    async getLink( @Param('url') url: string): Promise<ReviewLink> {
        let result = await this.manager.getReview(url)
        return result;
    }

    @Public()
    @Post('/:url')
    async makeReview(
        @Param('url') url: string,
        @Body() review: ReviewDTO
    ): Promise<boolean> {
        let result = await this.manager.makeReview(url, review.rate, review.comment);
        return result;
    }
}