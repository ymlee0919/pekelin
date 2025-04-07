import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';

@Injectable()
export class ReviewLinkPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const oldRegex = /^[a-z]+\d{8}$/;
    const newRegex = /^[a-z]+[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}$/;
    if (!oldRegex.test(value) && !newRegex.test(value)) {
      throw new NotFoundException('Invalid URL');
    }
    return value;
  }
}
