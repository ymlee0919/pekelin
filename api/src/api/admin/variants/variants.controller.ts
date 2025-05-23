import { BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    Patch
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreatedVariant, UpdatedVariant, BasicVariant, Variant, TinyVariantInfo } from "./variants.types";
import { VariantDTO } from './variants.dto';
import { InvalidOperationError } from 'src/common/errors/invalid.error';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, MulterMemoryOptions } from 'src/services/files/multer.options';
import { FileService } from 'src/services/files/file.services';
import { CloudService } from 'src/services/cloud/cloud.service';
import { ImageSrc } from 'src/common/types/common.types';
import { CropPngFilePipe } from 'src/services/pipes/crop.PngFile.pipe';
import { CustomParseIntPipe } from 'src/services/pipes/customParseInt.pipe';
import { RequirePermission } from 'src/common/decorators/permission.decorator';

@Controller('api/products')
@RequirePermission('Products')
export class VariantsController {

    constructor(
        private readonly manager: VariantsService,
        private readonly fileService: FileService,
        private readonly cloudService: CloudService
    ){}

    @Get('/variants/list')
    @HttpCode(HttpStatus.OK)
    async getList(
    ): Promise<Array<TinyVariantInfo>>{
        let result = await this.manager.getFullTinyList()
        return result ?? [];
    }

    @Get(':productId/variants')
    @HttpCode(HttpStatus.OK)
    async getProductList(
        @Param('productId', CustomParseIntPipe) productId: number
    ): Promise<Array<BasicVariant>>{
        let result = await this.manager.getList(productId);
        return result ?? [];
    }

    @Get(':productId/variants/:variantId')
    @HttpCode(HttpStatus.OK)
    async get(
        @Param('productId', CustomParseIntPipe) productId: number,
        @Param('variantId', CustomParseIntPipe) variantId: number
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
        @Param('productId', CustomParseIntPipe) productId: number,
        @UploadedFile(
            new ParseFilePipe({ fileIsRequired: true}),
            new CropPngFilePipe(multerConfig.localProductsDest)
        ) file: string,
        @Body() variant: VariantDTO
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
    async update(
        @Param('productId', CustomParseIntPipe) productId: number,
        @Param('variantId', CustomParseIntPipe) variantId: number,
        @Body() variant: VariantDTO,
        @UploadedFile( 
            new ParseFilePipe({ fileIsRequired: false}),
            new CropPngFilePipe(multerConfig.localProductsDest)
    ) file?: string) : Promise<UpdatedVariant> 
    {

       let fileName = (!!file) ? `${multerConfig.productsDest}${file}` : null;

        try {
            let remoteUrl : string | null = null;

            // Upload to cloud
            if(file)
                remoteUrl = await this.cloudService.uploadFile(fileName);

            let updated = await this.manager.updateVariant(productId, variantId, variant, (!!file) ? {
                local: fileName, remote: remoteUrl, expiryRemote: Math.round(Date.now() / 1000) + 72000
            } : null);

            // Delete the old image
            if(file) {
                let {oldImage, ...item} = updated;
                this.fileService.deleteFile(oldImage);
                this.cloudService.deleteFile(oldImage);
                updated = item;
            }

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

    @Patch('/:productId/variants/:variantId/view')
    @HttpCode(HttpStatus.OK)
    async changeVisibility(
        @Param('productId', CustomParseIntPipe) productId: number,
        @Param('variantId', CustomParseIntPipe) variantId: number
        ) : Promise<UpdatedVariant> 
    {
        try {
            
            let updated = await this.manager.changeVisibility(productId, variantId);
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

    @Delete(':productId/variants/:variantId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('productId', CustomParseIntPipe) productId: number,
        @Param('variantId', CustomParseIntPipe) variantId: number,
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