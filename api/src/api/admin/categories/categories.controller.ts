import { Body, 
    Controller, 
    Delete,
    Get,
    HttpStatus,
    HttpCode,
    Param,
    Post,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe, 
    Patch,
    BadRequestException} from '@nestjs/common';
import { CategoriesService } from './categories.service'
import { CreatedCategory, CategoryInfo, UpdatedCategory } from "./categories.types";
import { InvalidOperationError } from 'src/common/errors/invalid.error';
import { ImageSrc } from 'src/common/types/common.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, MulterMemoryOptions } from 'src/services/files/multer.options';
import { CategoryDTO } from './categories.dto';
import { FileService } from 'src/services/files/file.services';
import { CropJpgFilePipe } from 'src/services/pipes/crop.JpgFile.pipe';
import { CloudService } from 'src/services/cloud/cloud.service';
import { CustomParseIntPipe } from 'src/services/pipes/customParseInt.pipe';
import { RequirePermission } from 'src/common/decorators/permission.decorator';

@Controller('api/categories')
@RequirePermission('Categories')
export class CategoriesController {

    constructor(
        private readonly manager: CategoriesService,
        private readonly fileService: FileService,
        private readonly cloudService: CloudService
    ){}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getList(): Promise<Array<CategoryInfo>>{
        let result = await this.manager.getList();
        return result ?? [];
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image', MulterMemoryOptions))
    async addCategory(
        @UploadedFile(
            new ParseFilePipe({ fileIsRequired: true}),
            new CropJpgFilePipe(multerConfig.localCategoriesDest, 500, 500)
        ) file: string,
       @Body() category: CategoryDTO) : Promise<CreatedCategory> 
    {
        let fileName = `${multerConfig.categoriesDest}${file}`;

        try {
            // Upload to cloud
            let remoteUrl = await this.cloudService.uploadFile(fileName);

            let image : ImageSrc = {
                local: fileName,
                remote: remoteUrl,
                expiryRemote: Math.round(Date.now() / 60000) + 72000
            }

            let created = await this.manager.addCategory(category, image);
            return created;
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

    @Patch('/:categoryId')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('image', MulterMemoryOptions))
    async update(
        @Param('categoryId', CustomParseIntPipe) categoryId: number,
        @Body() category: CategoryDTO,
        @UploadedFile( 
            new ParseFilePipe({ fileIsRequired: false}),
            new CropJpgFilePipe(multerConfig.localCategoriesDest, 500, 500)
        ) file?: string) : Promise<UpdatedCategory> 
    {
        let fileName = (!!file) ? `${multerConfig.categoriesDest}${file}` : null;

        try {
            let remoteUrl : string | null = null;

            // Upload to cloud
            if(file)
                remoteUrl = await this.cloudService.uploadFile(fileName);

            let updated = await this.manager.updateCategory(categoryId, category, (!!file) ? {
                local: fileName, 
                remote: remoteUrl, 
                expiryRemote: Math.round(Date.now() / 60000) + 72000
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

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', CustomParseIntPipe) categoryId: number) : Promise<any> {

        try {
            let deleted = await this.manager.deleteCategory(categoryId);
            if (deleted) {
                // Delete the uploaded images
                this.fileService.deleteFile(deleted.icon);
                this.cloudService.deleteFile(deleted.icon);

                return;
            }
        } catch (error) {
            if (error instanceof InvalidOperationError) {
              throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }

        throw new BadRequestException('Unable to delete the category');
    }
    
}
