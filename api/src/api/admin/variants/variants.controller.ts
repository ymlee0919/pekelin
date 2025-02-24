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
    ParseFilePipe
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreatedVariant, UpdatedVariant, BasicVariant, BasicVariantInfo, Variant } from "./variants.types";
import { VariantDTO } from './variants.dto';
import { InvalidOperationError } from 'src/api/common/errors/invalid.error';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, MulterMemoryOptions } from 'src/services/files/multer.options';
import { CropJpgFilePipe } from 'src/services/pipes/crop.JpgFile.pipe';
import { FileService } from 'src/services/files/file.services';
import { CloudService } from 'src/services/cloud/cloud.service';
import { ImageSrc } from 'src/api/common/types/common.types';
import { plainToInstance } from 'class-transformer';
import { CropPngFilePipe } from 'src/services/pipes/crop.PngFile.pipe';

@Controller('api/products')
export class VariantsController {

    constructor(
        private readonly manager: VariantsService,
        private readonly fileService: FileService,
        private readonly cloudService: CloudService
    ){}

    @Get(':productId/variants')
    @HttpCode(HttpStatus.OK)
    async getList(
        @Param('productId', ParseIntPipe) productId: number
    ): Promise<Array<BasicVariant>>{
        let result = await this.manager.getList(productId);
        return result ?? [];
    }

    @Get(':productId/variants/:variantId')
    @HttpCode(HttpStatus.OK)
    async get(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('variantId', ParseIntPipe) variantId: number
    ): Promise<Variant>{
        let variant = await this.manager.get(productId, variantId);
        if(!!variant)
            return variant;

        throw new BadRequestException({
            success: false,
            errorCode: HttpStatus.BAD_REQUEST,
            message: 'Unable to find the requested variant'
        })
    }

    @Post(':productId/variants')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image', MulterMemoryOptions))
    async create(
        @Param('productId', ParseIntPipe) productId: number,
        @UploadedFile(
            new ParseFilePipe({ fileIsRequired: true}),
            new CropPngFilePipe(multerConfig.localProductsDest)
        ) file: string,
        @Body() body: any
    ): Promise<CreatedVariant>{
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
            const variant = plainToInstance(VariantDTO, {
                ...body,
                features
            });

            let createdVariant = await this.manager.createVariant(productId, variant, image);
            return createdVariant;
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

    @Put(':productId/variants/:variantId')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('image', MulterMemoryOptions))
    async updateImage(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('variantId', ParseIntPipe) variantId: number,
        @Body() body: any,
        @UploadedFile( 
            new ParseFilePipe({ fileIsRequired: false}),
            new CropPngFilePipe(multerConfig.localProductsDest)
    ) file?: string) : Promise<UpdatedVariant> 
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
            const product = plainToInstance(VariantDTO, {
                ...body,
                features
            });

            let updated = await this.manager.updateVariant(productId, variantId, product, (!!file) ? {
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

    @Delete(':productId/variants/:variantId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('variantId', ParseIntPipe) variantId: number,
    ): Promise<void>{
        try {
            let deleted = await this.manager.deleteVariant(productId, variantId);
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