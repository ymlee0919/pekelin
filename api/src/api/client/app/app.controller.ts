import { Controller, Get, Req, Res, UseGuards} from '@nestjs/common';
import { ClientAppService } from './app.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Request, Response } from 'express';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

import { doubleCsrf } from 'csrf-csrf';

const { generateToken } = doubleCsrf({
    getSecret: () => 'your-secret-key',
    cookieName: 'x-csrf-token',
});

@Controller('client/app')
export class ClientAppController {

    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(
        private readonly manager: ClientAppService
    ){}

    @Public()
    @Get('/')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 60, ttl: 3 } }) // 5 requests in 60 seconds
    async getAll(): Promise<any> {
        let result = await this.manager.getDatabase();
        return result;
    }

    @Public()
    @Get('/info')
    @Throttle({ default: { limit: 120, ttl: 1 } }) // 1 requests in 2 minutes
    async getInfo(): Promise<any> {
        let result = await this.manager.getInfo();
        return result;
    }

    @Get('csrf-token')
    @Public()
    getCsrfToken(@Req() req: Request, @Res() res: Response) {
        // Generar el token CSRF
        const token = generateToken(req, res);

        // Enviar el token en la respuesta (opcional)
        res.json({ csrfToken: token });
    }
}