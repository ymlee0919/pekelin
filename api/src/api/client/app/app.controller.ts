import { Controller, Get, Req} from '@nestjs/common';
import { ClientAppService } from './app.service';
import { Public } from 'src/api/admin/auth/guard/public.guard';

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
    async getAll(): Promise<any> {
        let result = await this.manager.getDatabase();
        return result;
    }

    @Public()
    @Get('/info')
    async getInfo(): Promise<any> {
        let result = await this.manager.getInfo();
        return result;
    }
}