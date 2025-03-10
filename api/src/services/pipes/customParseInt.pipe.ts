import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class CustomParseIntPipe extends ParseIntPipe {
    override async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
        try {
            return await super.transform(value, metadata);
        } catch (error) {
            throw new BadRequestException('Invalid URL');
        }
    }
}
