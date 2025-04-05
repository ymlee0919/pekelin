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
import { IS_PUBLIC_KEY } from '../../../../common/decorators/public.decorator';
import { AuthRequestContext } from '../context/auth.context';
import { AccountInfo } from "../../accounts/accounts.types";
import { DatabaseService } from 'src/services/database/database.service';
  
@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService, 
        private reflector: Reflector,
        private database: DatabaseService
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
            // Verify payload
            const payload = await this.jwtService.verifyAsync<AccountInfo>(token, {
                secret: process.env.JWT_SECRET
            });
            
            (request as Request)['authContext'] = new AuthRequestContext(payload);

            // Check permissions
            let requiredPermission = this.reflector.getAllAndOverride<string|string[]>(
                'permission',
                [context.getHandler(), context.getClass()]
            );
            if(typeof requiredPermission == "string")
                requiredPermission = [requiredPermission];

            let permissions = await this.database.accounts.findFirst({
                where: {
                    userId: payload.userId
                },
                select: {
                    userId: true,
                    Role: {
                        select: {
                            modules: {
                                select: {
                                    module: true
                                }
                            }
                        }
                    }
                }
            });

            if(!permissions)
                throw new UnauthorizedException("Unregistered");

            let allowedPermissions = permissions.Role.modules.map(value => value.module).concat('Dashboard');
            if(!allowedPermissions.some(element => requiredPermission.includes(element)))
                throw new ForbiddenException('Forbidden access');

        } catch(error) {
            if (error instanceof ForbiddenException || error instanceof UnauthorizedException) {
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
  