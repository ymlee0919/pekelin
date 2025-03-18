import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseFeaturesPipe implements PipeTransform 
{

    transform(value: any, metadata: ArgumentMetadata) 
    {
        try {
            console.log(value);
            value.features = JSON.parse(value.features);
            
            return value;
        } catch {
            throw new BadRequestException('Invalid features format');
        }
    }
}
