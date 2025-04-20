import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => 'your-secret-key',
    cookieName: 'x-csrf-token',
    cookieOptions: { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

@Injectable()
export class CsrfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        // Validate CSRF token for POST, PUT, PATCH, DELETE requests
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
            try {
                doubleCsrfProtection(request, response, (err) => {if(err) throw err});
                return true;
            } catch (error) {
                throw new ForbiddenException('Invalid CSRF token');
            }
        }

        return true;
    }
}