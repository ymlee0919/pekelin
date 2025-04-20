import { Controller, Get, Req, Res} from '@nestjs/common';
import { AppService, DashboardInfo} from './app.service';
import { AuthRequestContext } from '../auth/context/auth.context';
import { Request, Response } from 'express';

import { doubleCsrf } from 'csrf-csrf';
import { Public } from '../../../common/decorators/public.decorator';
import { RequirePermission } from 'src/common/decorators/permission.decorator';

const { generateToken } = doubleCsrf({
    getSecret: () => 'your-secret-key',
    cookieName: 'x-csrf-token',
    cookieOptions: { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

@Controller('api/app')
export class AppController {

    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(
        private readonly manager: AppService
    ){}

    @Get('/')
    @RequirePermission('Dashboard')
    async getList(@Req() request: Request): Promise<DashboardInfo> {
        let authContext = request['authContext'] as AuthRequestContext;
        let result = await this.manager.getDashboardInfo();
        return {...result, ...authContext.Obj};
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