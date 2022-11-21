import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { ContextProvider } from '../providers';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const user = <User>request.user;
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
