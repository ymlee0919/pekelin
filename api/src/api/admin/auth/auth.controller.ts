import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { CredentialsDTO } from "./auth.dto";
import { Public } from "../../../common/decorators/public.decorator";
import { InvalidOperationError } from "src/common/errors/invalid.error";
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { UserAuth } from "./auth.types";
import { Response } from "express";
import { TokenService } from "./services/tokens.service";
import { Cookie } from "src/common/decorators/cookie.decorator";

export interface AuthResponse {
    account: UserAuth;
    accessToken: string;
}

@Controller('api/auth')
export class AuthController {

    constructor(
        private readonly manager: AuthService,
        private readonly tokensService: TokenService
    ){}

    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 60, ttl: 5 } }) // 5 requests in 60 seconds
    async login(
        @Body() credentials: CredentialsDTO,
        @Res({ passthrough: true }) res: Response
    ) : Promise<AuthResponse> 
    {
        try {
            let account = await this.manager.login(credentials);
            if(!account)
                throw new BadRequestException('Invalid credentials');

            const {accessToken, refreshToken} = await this.tokensService.generateTokens(account, credentials.remember);

            // Set refresh token in HTTP-only cookie
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: credentials.remember 
                  ? 30 * 24 * 60 * 60 * 1000 // 30 days
                  : 24 * 60 * 60 * 1000, // 1 day
                path: '/api/auth/refresh', // Only sent to refresh endpoint
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

    @Public()
    @Get('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 60, ttl: 5 } }) // 5 requests in 60 seconds
    async refresh(
        @Cookie('refresh_token') refreshToken: string,
        @Res({ passthrough: true }) res: Response) 
    {
        if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

        try {
            const payload = await this.tokensService.verifyRefreshToken(refreshToken);
            const remember = this.tokensService.isLongLivedToken(refreshToken);
            let {exp, iat, ...account} = payload;
            
            const { accessToken, refreshToken: newRefreshToken } = 
                await this.tokensService.generateTokens(
                    account,
                    remember // Detect if original was "remember me" token
                );

            // Renew the refresh token cookie
            res.cookie('refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: remember
                    ? 30 * 24 * 60 * 60 * 1000 // 30 days
                    : 24 * 60 * 60 * 1000, // 1 day
                path: '/api/auth/refresh',
            });

            return { accessToken };
        } catch (e) {
            console.log(e);
            console.log('Invalid refresh token')
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    @Public()
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) res: Response) {
        
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth/refresh',
        });
        return { message: 'Logged out successfully' };
    }

}