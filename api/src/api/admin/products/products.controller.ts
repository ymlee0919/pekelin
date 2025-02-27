import { BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    Patch
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreatedProduct, UpdatedProduct, Product, BasicProductInfo } from "./products.types";
import { ProductDTO } from './products.dto';
import { InvalidOperationError } from 'src/api/common/errors/invalid.error';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, MulterMemoryOptions } from 'src/services/files/multer.options';
import { CropJpgFilePipe } from 'src/services/pipes/crop.JpgFile.pipe';
import { FileService } from 'src/services/files/file.services';
import { CloudService } from 'src/services/cloud/cloud.service';
import { ImageSrc } from 'src/api/common/types/common.types';
import { plainToInstance } from 'class-transformer';

@Controller('api/products')
export class ProductsController {

    constructor(
        private readonly manager: ProductsService,
        private readonly fileService: FileService,
        private readonly cloudService: CloudService
    ){}

    @Get('/list')
    @HttpCode(HttpStatus.OK)
    async getList(): Promise<Array<BasicProductInfo>>{
        let result = await this.manager.getList();
        return result ?? [];
    }

    @Get('/full')
    @HttpCode(HttpStatus.OK)
    async getFullList(): Promise<Array<Product>>{
        let result = await this.manager.getFullList();
        return result ?? [];
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async get(@Param('id', ParseIntPipe) productId: number): Promise<Product>{
        let product = await this.manager.get(productId);
        if(!!product)
            return product;

        throw new BadRequestException({
            success: false,
            errorCode: HttpStatus.BAD_REQUEST,
            message: 'Unable to find the requested product'
        })
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image', MulterMemoryOptions))
    async create(
        @UploadedFile(
            new ParseFilePipe({ fileIsRequired: true}),
            new CropJpgFilePipe(multerConfig.localProductsDest, 500, 500)
        ) file: string,
        @Body() body: any
    ): Promise<CreatedProduct>{
        let fileName = `${multerConfig.productsDest}${file}`;

        try {
            // Upload to cloud
            let remoteUrl = await this.cloudService.uploadFile(fileName);

            let image : ImageSrc = {
                local: fileName,
                remote: remoteUrl,
                expiryRemote: Math.round(Date.now() / 1000) + 72000
            }

            // Deserialize the features field
            const features = JSON.parse(body.features);
            // Create the DTO object
            const product = plainToInstance(ProductDTO, {
                ...body,
                features
            });

            let createdProduct = await this.manager.createProduct(product, image);
            return createdProduct;
        } catch (error) {
            // Delete the uploaded images
            this.fileService.deleteFile(fileName);
            this.cloudService.deleteFile(fileName);

            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
            
        }
    }

    @Put('/:productId')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('image', MulterMemoryOptions))
    async updateImage(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() body: any,
        @UploadedFile( 
            new ParseFilePipe({ fileIsRequired: false}),
            new CropJpgFilePipe(multerConfig.localProductsDest, 500, 500)
    ) file?: string) : Promise<UpdatedProduct> 
    {

       let fileName = (!!file) ? `${multerConfig.categoriesDest}${file}` : null;

        try {
            let remoteUrl : string | null = null;

            // Upload to cloud
            if(file)
                remoteUrl = await this.cloudService.uploadFile(fileName);

            // Deserialize the features field
            const features = JSON.parse(body.features);
            // Create the DTO object
            const product = plainToInstance(ProductDTO, {
                ...body,
                features
            });

            let updated = await this.manager.updateProduct(productId, product, (!!file) ? {
                local: fileName, remote: remoteUrl, expiryRemote: Math.round(Date.now() / 1000) + 72000
            } : null);

            return updated;
        } 
        catch (error) {
            // Delete the uploaded images
            if(file)
            {
                this.fileService.deleteFile(fileName);
                this.cloudService.deleteFile(fileName);
            }

            // Treat the error
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }

    @Patch('/:productId/view')
    @HttpCode(HttpStatus.OK)
    async changeVisibility(
        @Param('productId', ParseIntPipe) productId: number,
        ) : Promise<UpdatedProduct> 
    {
        try {
            
            let updated = await this.manager.changeVisibility(productId);
            return updated;
        } 
        catch (error) {
            // Treat the error
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('id', ParseIntPipe) productId: number
    ): Promise<void>{
        try {
            let deleted = await this.manager.deleteProduct(productId);
            if (deleted) {
                // Delete the uploaded images
                this.fileService.deleteFile(deleted.image);
                this.cloudService.deleteFile(deleted.image);

                return;
            }

        } catch (error) {
            if (error instanceof InvalidOperationError) {
              throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }

        throw new BadRequestException('Unable to delete the product');
    }
}