import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage, memoryStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
    localProductsDest: `${process.env.UPLOAD_ROOT}${process.env.PRODUCTS_LOCATION}`,
    productsDest: process.env.PRODUCTS_LOCATION,

    localCategoriesDest: `${process.env.UPLOAD_ROOT}${process.env.CATEGORIES_LOCATION}`,
    categoriesDest: process.env.CATEGORIES_LOCATION,
};

// Multer upload options
export const MulterStorageOptions = {
    // Enable file size limits
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) * 1024 * 1024,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = multerConfig.localProductsDest;
            // Create folder if doesn't exist
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            // Calling the callback passing the random name generated with the original extension name
            cb(null, `${uuid()}${extname(file.originalname)}`);
        },
    }),
};

// Multer upload options
export const MulterMemoryOptions = {
    // Enable file size limits
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) * 1024 * 1024,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: memoryStorage(),
};