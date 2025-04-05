import { Body, 
    Controller, 
    Delete, 
    Get, 
    HttpStatus,
    Param, 
    Post,
    Put,
    HttpCode,
    HttpException,
    BadRequestException 
} from '@nestjs/common';
import { AccountsService } from './accounts.service'
import { AccountInfo, CreatedAccount, UpdatedAccount } from "./accounts.types";
import { InvalidOperationError } from 'src/common/errors/invalid.error';
import { AccountCreationDTO, AccountCredentialsUpdateDTO, AccountUpdateDTO } from './accounts.dto';
import { CustomParseIntPipe } from 'src/services/pipes/customParseInt.pipe';
import { RequirePermission } from 'src/common/decorators/permission.decorator';

@Controller('api/accounts')
@RequirePermission('Account')
export class AccountsController {

    constructor(private readonly manager: AccountsService){}

    @Get('')
    @HttpCode(HttpStatus.OK)
    async getList(): Promise<Array<AccountInfo>>{
        let result = await this.manager.getList();
        return result ?? [];
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() account: AccountCreationDTO) : Promise<CreatedAccount> {
        try {
            let createdAccount = await this.manager.createAccount(account);
            if(createdAccount)
                return createdAccount;
            
        } catch (error) {
            if(error instanceof InvalidOperationError){
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }

        throw new HttpException('Unable to create the account', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', CustomParseIntPipe) userId: number,
        @Body() account: AccountUpdateDTO) : Promise<UpdatedAccount> 
    {
        try {
            let updatedAccount = await this.manager.update(userId, account.name, account.email);
            if(updatedAccount)
                return updatedAccount;

        } catch (error) {
            if (error instanceof InvalidOperationError) {
              throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }

        throw new HttpException('Unable to update the account', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Put('/:id/credentials')
    @HttpCode(HttpStatus.OK)
    async updateCredentials(@Param('id', CustomParseIntPipe) userId: number, 
        @Body() account: AccountCredentialsUpdateDTO
    ) : Promise<UpdatedAccount> {
        try {
            let updated = await this.manager.updateCredentials(userId, account);
            if(updated)
                return updated;
        } catch (error) {
            if (error instanceof InvalidOperationError) {
              throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }

        throw new HttpException('Unable to update the credentials', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', CustomParseIntPipe) userId: number) : Promise<void> {

        try {
            let success = await this.manager.deleteAccount(userId);
            if (success) return;    
        } catch (error) {
            if (error instanceof InvalidOperationError) {
              throw new BadRequestException(error.message);
            }
            throw new BadRequestException(error);
        }

        throw new HttpException('Unable to delete the account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
}
