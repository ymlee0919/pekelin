// token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserAuth, UserAuthPayload } from '../auth.types';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateTokens(account: UserAuth, rememberMe: boolean) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                account, {
                    secret: this.configService.get('JWT_ACCESS_SECRET'),
                    expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
                }
            ),
            this.jwtService.signAsync(
                account, {
                    secret: this.configService.get('JWT_REFRESH_SECRET'),
                    expiresIn: rememberMe 
                        ? this.configService.get('JWT_REFRESH_REMEMBER_ME_EXPIRES_IN')
                        : this.configService.get('JWT_REFRESH_EXPIRES_IN'),
                }
            ),
        ]);

        return { accessToken, refreshToken };
    }

    async verifyRefreshToken(token: string) : Promise<UserAuthPayload> {
        return this.jwtService.verifyAsync<UserAuthPayload>(token, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
    }

    isLongLivedToken(token: string): boolean {
        const payload = this.jwtService.decode(token);
        return payload.exp - payload.iat > 7 * 24 * 60 * 60; // > 7 days = remember me
    }
}