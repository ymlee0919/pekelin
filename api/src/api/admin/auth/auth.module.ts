import { Module } from '@nestjs/common';
import {ConfigService} from '@nestjs/config'

import { DatabaseModule } from 'src/services/database/database.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/tokens.service';

@Module({
    imports: [DatabaseModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '8h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard, ConfigService, TokenService],
    exports: [ AuthGuard ]
})
export class AuthModule {}