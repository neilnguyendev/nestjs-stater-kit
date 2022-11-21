import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import _ from 'lodash';

import type { RoleType } from '../constants';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());

    // if (_.isEmpty(roles)) {
    //   return true;
    // }

    // const request = context.switchToHttp().getRequest();
    // const user = <User>request.user;
    const role = 'USER'; // TODO: Update later when there are more than one role

    return roles.includes(<RoleType>role);
  }
}
