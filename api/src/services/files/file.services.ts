import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
    deleteFile(file: string): void 
    {
        const fullPath = path.join(process.cwd(), './', `${process.env.UPLOAD_ROOT}${file}`);
        // Check the file exists
        if (fs.existsSync(fullPath)) {
            try {
            // Delete the file
            fs.unlinkSync(fullPath);
            } catch (error) {
            
            }
        } 
    }
}
