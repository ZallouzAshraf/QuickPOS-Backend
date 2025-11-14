import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
  
      const cookieName = process.env.COOKIE_NAME as string;
      if (!cookieName) {
        throw new UnauthorizedException('Cookie name is not defined');
      }
  
      const token = request.cookies?.[cookieName];
      if (!token) {
        throw new UnauthorizedException('No access token provided');
      }
  
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
        request.user = payload;
        return true;
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  