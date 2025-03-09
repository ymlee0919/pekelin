import { Body, 
    Controller, 
    Delete, 
    Get, 
    HttpStatus,
    Param, 
    ParseIntPipe, 
    Post,
    Put,
    HttpCode,
    HttpException,
    BadRequestException 
} from '@nestjs/common';
import { InvalidOperationError } from 'src/api/common/errors/invalid.error';
import { ReviewsService } from './reviews.service';
import { CreatedReviewLink, ReviewLink } from './reviews.types';
import { ReviewLinkCreationDTO } from './reviews.dto';


@Controller('api/reviews')
export class ReviewsController {

    constructor(private readonly manager: ReviewsService){}

    @Get('')
    @HttpCode(HttpStatus.OK)
    async getList(): Promise<Array<ReviewLink>>{
        let result = await this.manager.getList();
        return result ?? [];
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() creationDto: ReviewLinkCreationDTO) : Promise<CreatedReviewLink> {
        try {
            let createdLink = await this.manager.createLink(creationDto.name);
            return createdLink;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }
    
}
