import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Connection, getConnection, Repository } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { InjectConnection } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'UserNotExistsValidator', async: true })
@Injectable()
export class UserNotExistsValidator implements ValidatorConstraintInterface {
  constructor(@InjectConnection() protected readonly connection: Connection) {}

  async validate(value: string) {
    try {
      const user = await this.connection
        .getRepository(User)
        .findOneBy({ email: value });

      if (user !== null) {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email already existed`;
  }
}
