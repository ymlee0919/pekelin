import { ValidationError, BadRequestException } from '@nestjs/common';

const CustomExceptionFactory = (errors: ValidationError[]) => {
    const groupedErrors = errors.reduce((acc, error) => {
        const { property, constraints } = error;
        if (!acc[property]) {
        acc[property] = [];
        }
        acc[property].push(...Object.values(constraints));
        return acc;
    }, {});

    return new BadRequestException({
        statusCode: 422,
        message: 'Validation failed',
        errors: groupedErrors,
    });
};

export default CustomExceptionFactory;