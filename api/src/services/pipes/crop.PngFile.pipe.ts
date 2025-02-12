import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CropPngFilePipe implements PipeTransform<Express.Multer.File, Promise<string>>
{
    constructor(private readonly targetDir:string,
        private readonly imgWidth: number = 0,
        private readonly imgHeight: number = 0
    ){  }

    async transform(image: Express.Multer.File): Promise<string> {
        if(!image)
            return '';

        const filename = `${uuid()}.png`;
        const uploadPath = this.targetDir;
        
        // Create folder if doesn't exist
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
        }

        let img = sharp(image.buffer);

        if(this.imgHeight != 0 && this.imgWidth != 0)
            img = img.resize(this.imgWidth, this.imgHeight, {
                fit: 'cover',
                position: 'center',
            });

        await img.png({
                quality: 100,
            }).toFile(path.join(uploadPath, filename));

        return filename;
    }
}
