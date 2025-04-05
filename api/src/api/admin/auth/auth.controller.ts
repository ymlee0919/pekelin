import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CredentialsDTO } from "./auth.dto";
import { JwtService } from '@nestjs/jwt';
import { Public } from "../../../common/decorators/public.decorator";
import { InvalidOperationError } from "src/common/errors/invalid.error";
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { UserAuth } from "./auth.types";

export interface AuthResponse {
    account: UserAuth;
    accessToken: string;
}

@Controller('api/auth')
export class AuthController {

    constructor(
        private readonly manager: AuthService,
        private readonly jwtService: JwtService
    ){}

    @Public()
    @Post('/')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 60, ttl: 5 } }) // 5 requests in 60 seconds
    async login(@Body() credentials: CredentialsDTO) : Promise<AuthResponse> 
    {
        try {
            let account = await this.manager.login(credentials);
            if(!account)
                throw new BadRequestException('Invalid credentials');

            const accessToken = this.jwtService.sign(account, {
                secret: process.env.JWT_SECRET
            });
            return {
                account, accessToken
            }
        }
        catch(error:any) {
            if(error instanceof InvalidOperationError)
                throw new BadRequestException(error.message);
            else
                throw new BadRequestException(error);
        }
    }

}