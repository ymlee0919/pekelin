import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';

@Injectable()
export class ReviewLinkPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const regex = /^[a-z]+\d{8}$/;
    if (!regex.test(value)) {
      throw new NotFoundException('Invalid URL');
    }
    return value;
  }
}
