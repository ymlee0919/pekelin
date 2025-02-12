import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable, Scope, Inject,
    UnauthorizedException
  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.guard';
import { AuthRequestContext } from '../context/auth.context';
import { AccountInfo } from "../../accounts/accounts.types";
  
@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService, 
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        if(!this.reflector)
            this.reflector = new Reflector();

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic)
            return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync<AccountInfo>(token, {
                secret: process.env.JWT_SECRET
            });
            
            (request as Request)['authContext'] = new AuthRequestContext(payload);

        } catch(error) {
            console.log(error);
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
  