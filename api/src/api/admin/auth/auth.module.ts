import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/services/database/database.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [DatabaseModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '8h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    exports: [ AuthGuard ]
})
export class AuthModule {}