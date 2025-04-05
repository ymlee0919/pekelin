import { Body, 
    Controller, 
    Get, 
    HttpStatus,
    Post,
    HttpCode,
    BadRequestException, 
    Delete,
    Param,
    NotFoundException
} from '@nestjs/common';
import { InvalidOperationError } from 'src/common/errors/invalid.error';
import { ReviewsService } from './reviews.service';
import { CreatedReviewLink, ReviewLink } from './reviews.types';
import { ReviewLinkCreationDTO } from './reviews.dto';
import { CustomParseIntPipe } from 'src/services/pipes/customParseInt.pipe';
import { RequirePermission } from 'src/common/decorators/permission.decorator';


@Controller('api/reviews')
@RequirePermission('Review')
export class ReviewsController {

    constructor(private readonly manager: ReviewsService){}

    @Get('')
    @HttpCode(HttpStatus.OK)
    async getList(): Promise<Array<ReviewLink>>{
        let result = await this.manager.getList();
        return result ?? [];
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async get(@Param('id', CustomParseIntPipe) linkId: number): Promise<ReviewLink>{
        let result = await this.manager.get(linkId);
        
        if(result)
            return result;
        
        throw new NotFoundException("Link not found");
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() creationDto: ReviewLinkCreationDTO) : Promise<CreatedReviewLink> {
        try {
            let createdLink = await this.manager.createLink(creationDto.name, creationDto.place);
            return createdLink;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', CustomParseIntPipe) linkId: number) : Promise<ReviewLink> {

        try {
            let deleted = await this.manager.deleteLink(linkId);
            return deleted;
        } catch (error) {
            if (error instanceof InvalidOperationError) {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }
    
}
