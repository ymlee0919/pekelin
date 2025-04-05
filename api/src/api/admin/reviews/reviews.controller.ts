import { Body, 
    Controller, 
    Get, 
    HttpStatus,
    Post,
    HttpCode,
    BadRequestException, 
    Delete,
    Param,
    NotFoundException,
    Put,
    Patch
} from '@nestjs/common';
import { InvalidOperationError } from 'src/common/errors/invalid.error';
import { ReviewsService } from './reviews.service';
import { CreatedReviewLink, ReviewLink, ReviewLinkData } from './reviews.types';
import { ClientLinkCreationDTO, ReviewDTO, ReviewLinkCreationDTO } from './reviews.dto';
import { CustomParseIntPipe } from 'src/services/pipes/customParseInt.pipe';
import { RequirePermission } from 'src/common/decorators/permission.decorator';
import { NotFoundError } from 'src/common/errors/notFound.error';


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

    @Put('')
    @HttpCode(HttpStatus.CREATED)
    async createClientLink(@Body() linkDto: ClientLinkCreationDTO) : Promise<CreatedReviewLink> {
        try {
            let createdLink = await this.manager.createClientLink(linkDto.clientId);
            return createdLink;
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            if(error instanceof NotFoundError){
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException(error);
        }
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateReview(
        @Param('id', CustomParseIntPipe) linkId: number,
        @Body() reviewDto: ReviewDTO
    ) : Promise<ReviewLinkData> {

        try {
            let review = await this.manager.updateReview(linkId, reviewDto);
            return review;
        } catch (error) {
            if (error instanceof InvalidOperationError) {
                throw new BadRequestException(error.message);
            }
            if(error instanceof NotFoundError){
                throw new NotFoundException(error.message);
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
