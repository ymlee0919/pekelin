import { Controller, Get, Req} from '@nestjs/common';
import { AppService, DashboardInfo} from './app.service';
import { AuthRequestContext } from '../auth/context/auth.context';
import { Request } from 'express';


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
    async getList(@Req() request: Request): Promise<DashboardInfo> {
        let authContext = request['authContext'] as AuthRequestContext;
        let result = await this.manager.getDashboardInfo();
        return {...result, ...authContext.Obj};
    }

}